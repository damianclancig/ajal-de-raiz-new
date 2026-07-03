/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


"use client";

import React from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/hooks/use-language";

interface TableActionsProps {
  editHref: string;
  onDelete: () => void;
  isDeleting?: boolean;
  deleteTitle?: string;
  deleteDescription?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  disabledDelete?: boolean;
}

export function TableActions({
  editHref,
  onDelete,
  isDeleting = false,
  deleteTitle,
  deleteDescription,
  editTooltip,
  deleteTooltip,
  disabledDelete = false,
}: TableActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-9 w-9 border-muted-foreground/20 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-sm transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={editHref}>
              <Edit className="h-4.5 w-4.5" />
              <span className="sr-only">{editTooltip || t('Edit')}</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{editTooltip || t('Edit')}</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-destructive border-destructive/20 hover:border-destructive hover:bg-destructive/10 shadow-sm transition-all"
                disabled={isDeleting || disabledDelete}
              >
                <Trash2 className="h-4.5 w-4.5" />
                <span className="sr-only">{deleteTooltip || t('Delete')}</span>
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{deleteTooltip || t('Delete')}</p>
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle || t('Are_you_sure')}</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {deleteDescription || t('This_action_cannot_be_undone_permanently')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
