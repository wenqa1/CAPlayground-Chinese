"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEditor } from "./editor-context";
import type { AnyLayer } from "@/lib/ca/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LayerContextMenuProps = {
  layer: AnyLayer;
  children: React.ReactNode;
  siblings: AnyLayer[];
};

export function LayerContextMenu({ layer, children, siblings }: LayerContextMenuProps) {
  const { t } = useTranslations("layers");
  const { t: tc } = useTranslations("common");
  const { moveLayer, updateLayer, duplicateLayer, deleteLayer } = useEditor();
  const [renameOpen, setRenameOpen] = useState(false);
  const [nameVal, setNameVal] = useState<string>((layer as any).name || "");

  const siblingsIds = siblings.map((l) => l.id);
  const idx = useMemo(() => {
    return siblingsIds.findIndex((id) => id === layer.id)
  },
    [JSON.stringify(siblingsIds), layer.id]
  );
  const n = siblings.length;

  const canSendBackward = idx > 0;
  const canBringForward = idx >= 0 && idx < n - 1;
  const canSendToBack = canSendBackward;
  const canSendToFront = canBringForward;

  const bringForward = async () => {
    if (!canBringForward) return;
    if (idx < n - 2) {
      const beforeId = siblings[idx + 2].id;
      moveLayer(layer.id, beforeId);
    } else if (idx === n - 2) {
      const next = siblings[n - 1];
      moveLayer(next.id, layer.id);
    }
  };

  const sendBackward = async () => {
    if (!canSendBackward) return;
    const prev = siblings[idx - 1];
    moveLayer(layer.id, prev.id);
  };

  const sendToBack = async () => {
    if (!canSendToBack) return;
    const first = siblings[0];
    moveLayer(layer.id, first.id);
  };

  const sendToFront = async () => {
    if (!canSendToFront) return;
    for (let i = idx + 1; i < n; i++) {
      const sib = siblings[i];
      moveLayer(sib.id, layer.id);
    }
  };

  const openRename = () => {
    setNameVal(((layer as any).name || "") as string);
    setRenameOpen(true);
  };
  const submitRename = () => {
    const next = (nameVal || "").trim();
    const currentName = (layer as any).name || "";
    if (next && next !== currentName) {
      updateLayer(layer.id, { name: next } as any);
    }
    setRenameOpen(false);
  };

  const duplicate = async () => { duplicateLayer(layer.id); };
  const remove = async () => { deleteLayer(layer.id); };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem disabled={!canSendToFront} onSelect={sendToFront}>{t("bringToFront")}</ContextMenuItem>
          <ContextMenuItem disabled={!canBringForward} onSelect={bringForward}>{t("bringForward")}</ContextMenuItem>
          <ContextMenuItem disabled={!canSendBackward} onSelect={sendBackward}>{t("sendBackward")}</ContextMenuItem>
          <ContextMenuItem disabled={!canSendToBack} onSelect={sendToBack}>{t("sendToBack")}</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={openRename}>{tc("rename")}</ContextMenuItem>
          <ContextMenuItem onSelect={duplicate}>{t("duplicateLayer")}</ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={remove}>{tc("delete")}</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{t("renameLayer")}</DialogTitle>
            <DialogDescription>{t("renameHint")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); }}
              placeholder={t("layerName")}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>{tc("cancel")}</Button>
            <Button onClick={submitRename}>{tc("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
