import { prisma } from './prisma';

export interface JobPayload {
  type: string;
  data: any;
}

export class JobQueue {
  async enqueue(job: JobPayload, scheduledFor?: Date): Promise<string> {
    const created = await prisma.job.create({
      data: {
        type: job.type,
        payload: JSON.stringify(job.data),
        scheduledFor: scheduledFor || new Date(),
      },
    });

    return created.id;
  }

  async dequeue(type?: string): Promise<{ id: string; type: string; data: any } | null> {
    const now = new Date();

    const job = await prisma.job.findFirst({
      where: {
        status: 'pending',
        scheduledFor: {
          lte: now,
        },
        ...(type && { type }),
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    if (!job) return null;

    // Mark as processing
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'processing',
        startedAt: new Date(),
        attempts: { increment: 1 },
      },
    });

    return {
      id: job.id,
      type: job.type,
      data: JSON.parse(job.payload),
    };
  }

  async complete(jobId: string): Promise<void> {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  async fail(jobId: string, error: string): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) return;

    const shouldRetry = job.attempts < job.maxAttempts;

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: shouldRetry ? 'pending' : 'failed',
        error,
        scheduledFor: shouldRetry
          ? new Date(Date.now() + 60000 * Math.pow(2, job.attempts)) // Exponential backoff
          : job.scheduledFor,
      },
    });
  }

  async cleanupOldJobs(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.job.deleteMany({
      where: {
        status: { in: ['completed', 'failed'] },
        completedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}

export const jobQueue = new JobQueue();

// Job processor - run this in a separate process or as a background task
export async function processJobs() {
  console.log('🔄 Starting job processor...');

  while (true) {
    try {
      const job = await jobQueue.dequeue();

      if (!job) {
        // No jobs available, wait before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      console.log(`Processing job ${job.id} of type ${job.type}`);

      // Process different job types
      try {
        switch (job.type) {
          case 'deadline-reminder':
            await processDeadlineReminder(job.data);
            break;
          case 'essay-feedback':
            await processEssayFeedback(job.data);
            break;
          default:
            console.warn(`Unknown job type: ${job.type}`);
        }

        await jobQueue.complete(job.id);
        console.log(`✅ Completed job ${job.id}`);
      } catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error);
        await jobQueue.fail(job.id, error instanceof Error ? error.message : 'Unknown error');
      }
    } catch (error) {
      console.error('Job processor error:', error);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

async function processDeadlineReminder(data: any) {
  // Send deadline reminder notification
  console.log('Sending deadline reminder:', data);
  // Implementation would go here
}

async function processEssayFeedback(data: any) {
  // Generate AI feedback for essay
  console.log('Generating essay feedback:', data);
  // Implementation would go here
}