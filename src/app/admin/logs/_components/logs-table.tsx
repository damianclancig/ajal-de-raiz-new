
'use client';

import * as React from 'react';
import type { AppErrorLog } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface LogsTableProps {
  logs: AppErrorLog[];
  onToggleResolved: (logId: string) => void;
  isPending: boolean;
}

export default function LogsTable({ logs, onToggleResolved, isPending }: LogsTableProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  };

  if (logs.length === 0) {
    return (
      <Card className="text-center p-12">
        <p className="text-lg font-medium">¡Todo en orden!</p>
        <p className="text-muted-foreground">No se han registrado errores.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {logs.map((log) => (
            <Accordion key={log.id} type="single" collapsible>
              <AccordionItem value={log.id} className={cn("border-b last:border-b-0 transition-colors hover:bg-muted/50", log.isResolved && 'bg-green-500/10 hover:bg-green-500/20')}>
                <div className="flex items-center p-4">
                  <AccordionTrigger className="flex-1 text-left hover:no-underline">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
                       <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                            <p className="font-semibold truncate" title={log.errorMessage}>{log.errorMessage}</p>
                       </div>
                       <div className="flex-shrink-0 mt-2 md:mt-0">
                            <Badge variant={log.isResolved ? "default" : "destructive"}>
                                {log.isResolved ? 'Resuelto' : 'No Resuelto'}
                            </Badge>
                       </div>
                       <div className="flex-shrink-0 mt-2 md:mt-0 text-sm font-medium text-muted-foreground truncate" title={log.path}>
                         <span className="font-mono">{log.path}</span>
                       </div>
                    </div>
                  </AccordionTrigger>
                   <div className="flex items-center space-x-2 pl-4 ml-4 border-l">
                        <Checkbox 
                            id={`resolve-${log.id}`} 
                            checked={log.isResolved}
                            onCheckedChange={() => onToggleResolved(log.id)}
                            disabled={isPending}
                        />
                        <Label htmlFor={`resolve-${log.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Resuelto
                        </Label>
                    </div>
                </div>
                <AccordionContent>
                  <div className="bg-muted/50 p-4 text-sm border-t space-y-4">
                    <div>
                        <h4 className="font-semibold">Función:</h4>
                        <p className="font-mono bg-background p-2 rounded-md mt-1">{log.functionName}</p>
                    </div>
                     {log.stackTrace && (
                        <div>
                            <h4 className="font-semibold">Stack Trace:</h4>
                            <pre className="font-mono text-xs bg-background p-2 rounded-md mt-1 overflow-x-auto">
                                <code>{log.stackTrace}</code>
                            </pre>
                        </div>
                     )}
                     {log.metadata && (
                        <div>
                            <h4 className="font-semibold">Metadatos Adicionales:</h4>
                             <pre className="font-mono text-xs bg-background p-2 rounded-md mt-1 overflow-x-auto">
                                <code>{JSON.stringify(log.metadata, null, 2)}</code>
                            </pre>
                        </div>
                     )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
