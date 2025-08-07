
"use client";

import type { AppErrorLog } from '@/lib/types';
import { clearAllLogs, toggleLogResolvedStatus } from '@/lib/log-service';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import LogsTable from './logs-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LogsClientPageProps {
    logs: AppErrorLog[];
}

export default function LogsClientPage({ logs }: LogsClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const handleClearLogs = () => {
    startTransition(async () => {
      const result = await clearAllLogs();
      if(result.success) {
        toast({ title: "Logs Cleared", description: "All error logs have been deleted." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  }

  const handleToggleResolved = async (logId: string) => {
    startTransition(async () => {
      const result = await toggleLogResolvedStatus(logId);
       if(!result.success) {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">Error Logs</h1>
          <p className="text-muted-foreground">Review application errors to diagnose issues.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isPending || logs.length === 0}>
              <Trash2 className="mr-2" />
              Clear All Logs
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle />
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible and will permanently delete all logs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearLogs} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                {isPending && <Loader2 className="mr-2 animate-spin" />}
                Yes, clear logs
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <LogsTable 
        logs={logs} 
        onToggleResolved={handleToggleResolved}
        isPending={isPending} 
      />
    </>
  );
}
