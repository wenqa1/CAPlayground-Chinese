"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import type { InspectorTabProps } from "../types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "@/hooks/use-translations";

interface TextTabProps extends Omit<InspectorTabProps, 'getBuf' | 'setBuf' | 'clearBuf' | 'round2' | 'fmt2' | 'fmt0' | 'updateLayerTransient' | 'selectedBase'> {
  activeState?: string;
}

export function TextTab({
  selected,
  updateLayer,
  activeState,
}: TextTabProps) {
  if (selected.type !== 'text') return null;
  const inState = !!activeState && activeState !== 'Base State';
  const { t } = useTranslations("textTab");
  const { t: tc } = useTranslations("common");
  const align = (((selected as any).align) || 'center') as 'left' | 'center' | 'right' | 'justified';

  return (
    <div className="grid grid-cols-2 gap-x-1.5 gap-y-3">
      <div className="space-y-1 col-span-2">
        <Label htmlFor="text">{t("text")}</Label>
        <Input id="text" value={selected.text}
          onChange={(e) => updateLayer(selected.id, { text: e.target.value } as any)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="fontSize">{t("fontSize")}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
        <Input id="fontSize" type="number" value={selected.fontSize}
          disabled={inState}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return;
            updateLayer(selected.id, { fontSize: Number(v) } as any)
          }} />
            </div>
          </TooltipTrigger>
          {inState && <TooltipContent sideOffset={6}>{t("notSupportedStateTransition")}</TooltipContent>}
        </Tooltip>
      </div>
      <div className="space-y-1">
        <Label htmlFor="color">{t("color")}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
        <Input id="color" type="color" value={selected.color}
          disabled={inState}
          onChange={(e) => updateLayer(selected.id, { color: e.target.value } as any)} />
            </div>
          </TooltipTrigger>
          {inState && <TooltipContent sideOffset={6}>{t("notSupportedStateTransition")}</TooltipContent>}
        </Tooltip>
      </div>
      <div className="space-y-1 col-span-2">
        <Label htmlFor="fontFamily">{t("font")}</Label>
        <Select value={(selected as any).fontFamily || 'SFProText-Regular'}
          onValueChange={(v) => updateLayer(selected.id, { fontFamily: v } as any)}>
          <SelectTrigger className="h-8 text-xs w-full" id="fontFamily">
            <SelectValue placeholder={t("selectFont")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SFProText-Regular">{t("systemDefaultFont")}</SelectItem>
            <SelectItem value="TimesNewRomanPSMT">{t("timesNewRoman")}</SelectItem>
            <SelectItem value="Copperplate">{t("copperplate")}</SelectItem>
            <SelectItem value="CourierNewPSMT">{t("courierNew")}</SelectItem>
            <SelectItem value="Futura-Medium">{t("futura")}</SelectItem>
            <SelectItem value="Georgia">{t("georgia")}</SelectItem>
            <SelectItem value="Papyrus">{t("papyrus")}</SelectItem>
            <SelectItem value="Verdana">{t("verdana")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 col-span-2">
        <Label>{t("alignment")}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={inState ? 'opacity-50 pointer-events-none' : ''}>
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant={align === 'left' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'left'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'left' } as any)}
            title={t("alignLeft")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={align === 'center' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'center'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'center' } as any)}
            title={t("alignCenter")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={align === 'right' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'right'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'right' } as any)}
            title={t("alignRight")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={align === 'justified' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-full"
            aria-pressed={align === 'justified'}
            disabled={inState}
            onClick={() => updateLayer(selected.id, { align: 'justified' } as any)}
            title={t("justify")}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
            </div>
          </TooltipTrigger>
          {inState && <TooltipContent sideOffset={6}>{t("notSupportedStateTransition")}</TooltipContent>}
        </Tooltip>
      </div>
      <div className="space-y-1 col-span-2">
        <Label>{t("wrapLines")}</Label>
        <div className="flex items-center gap-2 h-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
          <Switch checked={(((selected as any).wrapped ?? 1) as number) === 1}
            disabled={inState}
            onCheckedChange={(checked) => updateLayer(selected.id, { wrapped: (checked ? 1 : 0) as any } as any)} />
              </div>
            </TooltipTrigger>
            {inState && <TooltipContent sideOffset={6}>{t("notSupportedStateTransition")}</TooltipContent>}
          </Tooltip>
          <span className="text-xs text-muted-foreground">{t("wrapDescription")}</span>
        </div>
      </div>
    </div>
  );
}
