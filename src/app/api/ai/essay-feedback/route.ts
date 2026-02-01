import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ollama } from '@/lib/ai/ollama';
import { formatEssayFeedbackPrompt } from '@/lib/ai/prompts';
import { guardrails } from '@/lib/ai/guardrails';
import { aiRateLimiter, getRateLimitIdentifier } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // AI-specific rate limiting
    const identifier = `ai:${user.id}`;
    const rateLimit = await aiRateLimiter.checkLimit(identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many AI requests. Please try again in a minute.',
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
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

    // Verify essay ownership
    const essay = await prisma.essay.findUnique({
      where: { id: essayId },
    });

    if (!essay || essay.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Essay not found' }, { status: 404 });
    }

    // Validate content
    const contentValidation = guardrails.validateEssayContent(content);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { success: false, error: contentValidation.error },
        { status: 400 }
      );
    }

    // Check content safety
    const safetyCheck = await guardrails.checkContent(content);
    if (!safetyCheck.safe) {
      return NextResponse.json(
        { success: false, error: safetyCheck.reason || 'Content failed safety check' },
        { status: 400 }
      );
    }

    // Generate AI feedback
    const aiPrompt = formatEssayFeedbackPrompt(prompt, content);
    const aiResponse = await ollama.generate(aiPrompt, { temperature: 0.3 });

    // Parse structured response
    const feedback = guardrails.parseJSONResponse(aiResponse);

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Save AI interaction
    await prisma.aIInteraction.create({
      data: {
        userId: user.id,
        type: 'essay-feedback',
        prompt: aiPrompt,
        response: JSON.stringify(feedback),
        model: process.env.OLLAMA_MODEL || 'llama3',
      },
    });

    // Save feedback to essay
    await prisma.essayFeedback.create({
      data: {
        essayId,
        feedback: JSON.stringify(feedback),
        isAI: true,
      },
    });

    return NextResponse.json({
      success: true,
      feedback: {
        narrativeClarity: feedback.narrativeClarity || { score: 0, comments: 'No analysis available' },
        promptAlignment: feedback.promptAlignment || { score: 0, comments: 'No analysis available' },
        specificityVsGenerality: feedback.specificityVsGenerality || { score: 0, comments: 'No analysis available' },
        revisionSuggestions: feedback.revisionSuggestions || [],
        overallAssessment: feedback.overallAssessment || 'No assessment available',
      },
    });
  } catch (error) {
    console.error('Essay feedback error:', error);

    if (error instanceof Error && error.message.includes('Ollama')) {
      return NextResponse.json(
        { success: false, error: 'AI service unavailable. Please ensure Ollama is running.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate essay feedback' },
      { status: 500 }
    );
  }
}