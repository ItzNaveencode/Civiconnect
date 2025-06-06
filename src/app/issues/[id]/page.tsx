import type { Issue } from '@/types';
import { mockIssues } from '@/lib/mockData';
import IssueDetailsCard from '@/components/issues/IssueDetailsCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { generateIssueImage } from '@/ai/flows/generate-issue-image-flow';

// Simulate fetching a single issue by ID and generate image if it's a placeholder
async function getIssueByIdWithGeneratedImage(id: string): Promise<Issue | null> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  let issue = mockIssues.find(issue => issue.id === id) || null;

  if (issue && issue.imageUrl && issue.imageUrl.startsWith('https://placehold.co') && issue.imageAiHint) {
    try {
      // console.log(`Details Page: Generating image for hint: ${issue.imageAiHint}`);
      const imageResult = await generateIssueImage({ prompt: issue.imageAiHint });
      if (imageResult.imageDataUri) {
        issue = { ...issue, imageUrl: imageResult.imageDataUri };
      }
    } catch (error) {
      console.error(`Details Page: Failed to generate image for '${issue.imageAiHint}':`, error);
      // Keep placeholder if generation fails
    }
  }
  return issue;
}

interface IssueDetailsPageProps {
  params: { id: string };
}

export default async function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  const issue = await getIssueByIdWithGeneratedImage(params.id);

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Issue Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The issue you are looking for does not exist or may have been removed.
        </p>
        <Button asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Link href="/" className="text-sm text-primary hover:underline flex items-center mb-4">
        &larr; Back to Dashboard
      </Link>
      <IssueDetailsCard issue={issue} />
    </div>
  );
}
