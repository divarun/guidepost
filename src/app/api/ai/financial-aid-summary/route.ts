import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ollama } from '@/lib/ai/ollama';
import { formatFinancialAidPrompt } from '@/lib/ai/prompts';
import { guardrails } from '@/lib/ai/guardrails';
import { aiRateLimiter } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
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
    const { documentType, content } = body;

    if (!documentType || !content) {
      return NextResponse.json(
        { success: false, error: 'Document type and content are required' },
        { status: 400 }
      );
    }

    const validTypes = ['fafsa', 'award-letter', 'scholarship'];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Check content length
    if (content.length > 50000) {
      return NextResponse.json(
        { success: false, error: 'Content exceeds maximum length' },
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

    // Generate AI summary
    const aiPrompt = formatFinancialAidPrompt(documentType, content);
    const aiResponse = await ollama.generate(aiPrompt, { temperature: 0.2 });

    // Parse structured response
    const summary = guardrails.parseJSONResponse(aiResponse);

    if (!summary) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Save AI interaction
    await prisma.aIInteraction.create({
      data: {
        userId: user.id,
        type: 'financial-aid-summary',
        prompt: aiPrompt,
        response: JSON.stringify(summary),
        model: process.env.OLLAMA_MODEL || 'llama3',
      },
    });

    return NextResponse.json({
      success: true,
      summary: {
        keyPoints: summary.keyPoints || [],
        importantDeadlines: summary.importantDeadlines || [],
        actionItems: summary.actionItems || [],
        financialBreakdown: summary.financialBreakdown || null,
      },
    });
  } catch (error) {
    console.error('Financial aid summary error:', error);

    if (error instanceof Error && error.message.includes('Ollama')) {
      return NextResponse.json(
        { success: false, error: 'AI service unavailable. Please ensure Ollama is running.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}