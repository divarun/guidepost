import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { nim } from '@/lib/ai/nvidia-nim';
import { formatEssayFeedbackPrompt } from '@/lib/ai/prompts';
import { guardrails } from '@/lib/ai/guardrails';
import { aiRateLimiter } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const identifier = `ai:${user.id}`;
    const rateLimit = await aiRateLimiter.checkLimit(identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many AI requests. Please try again in a minute.', remaining: rateLimit.remaining, resetAt: rateLimit.resetAt },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { essayId, content, prompt } = body;

    if (!essayId || !content || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Essay ID, content, and prompt are required' },
        { status: 400 }
      );
    }

    const essay = await prisma.essay.findUnique({ where: { id: essayId } });
    if (!essay || essay.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Essay not found' }, { status: 404 });
    }

    const contentValidation = guardrails.validateEssayContent(content);
    if (!contentValidation.valid) {
      return NextResponse.json({ success: false, error: contentValidation.error }, { status: 400 });
    }

    const safetyCheck = guardrails.checkContent(content);
    if (!safetyCheck.safe) {
      return NextResponse.json({ success: false, error: safetyCheck.reason }, { status: 400 });
    }

    const aiPrompt = formatEssayFeedbackPrompt(prompt, content);
    const aiResponse = await nim.generate(aiPrompt, { temperature: 0.3, max_tokens: 1024 });

    const feedback = guardrails.parseJSONResponse<any>(aiResponse);
    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Failed to parse AI response' }, { status: 500 });
    }

    const model = process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-70b-instruct';

    await prisma.aIInteraction.create({
      data: { userId: user.id, type: 'essay-feedback', prompt: aiPrompt, response: JSON.stringify(feedback), model },
    });

    await prisma.essayFeedback.create({
      data: { essayId, feedback: JSON.stringify(feedback), isAI: true },
    });

    return NextResponse.json({
      success: true,
      feedback: {
        narrativeClarity: feedback.narrativeClarity ?? { score: 0, comments: 'No analysis available' },
        promptAlignment: feedback.promptAlignment ?? { score: 0, comments: 'No analysis available' },
        specificityVsGenerality: feedback.specificityVsGenerality ?? { score: 0, comments: 'No analysis available' },
        revisionSuggestions: feedback.revisionSuggestions ?? [],
        overallAssessment: feedback.overallAssessment ?? 'No assessment available',
      },
    });
  } catch (error) {
    console.error('Essay feedback error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate essay feedback';
    return NextResponse.json({ success: false, error: message }, { status: 503 });
  }
}
