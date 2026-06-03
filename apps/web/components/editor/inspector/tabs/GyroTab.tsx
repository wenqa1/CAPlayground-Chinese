"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AnyLayer, GyroParallaxDictionary } from "@/lib/ca/types";
import { X } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

interface GyroTabProps {
  selected: AnyLayer;
  wallpaperParallaxGroups: GyroParallaxDictionary[];
  setDoc: (updater: (prev: any) => any) => void;
}

export function GyroTab({
  selected,
  wallpaperParallaxGroups,
  setDoc,
}: GyroTabProps) {
  const { t } = useTranslations("gyroTab");
  const { t: tc } = useTranslations("common");
  const transformLayerName = selected?.name;
  const layerDicts = wallpaperParallaxGroups.filter(d => d.layerName === transformLayerName);
  const addDictionary = () => {
    if (layerDicts.length >= 10) {
      return;
    }
    const newDict = {
      axis: 'x' as 'x' | 'y',
      image: 'null',
      keyPath: 'position.x' as any,
      layerName: transformLayerName || '',
      mapMaxTo: 50,
      mapMinTo: -50,
      title: 'New Gyro Effect',
    };
    setDoc((prev: any) => {
      if (!prev) return prev;
      const key = prev.activeCA;
      const currentDicts = prev.docs[key].wallpaperParallaxGroups || [];
      return {
        ...prev,
        docs: {
          ...prev.docs,
          [key]: {
            ...prev.docs[key],
            wallpaperParallaxGroups: [...currentDicts, newDict],
          },
        },
      };
    });
  };

  const updateDictionary = (index: number, updates: Partial<typeof layerDicts[0]>) => {
    setDoc((prev: any) => {
      if (!prev) return prev;
      const key = prev.activeCA;
      const allDicts = prev.docs[key].wallpaperParallaxGroups || [];
      const globalIndex = allDicts.findIndex((d: any, i: number) => d.layerName === transformLayerName && layerDicts.findIndex(ld => ld === d) === index);
      if (globalIndex === -1) return prev;
      const updated = [...allDicts];
      updated[globalIndex] = { ...updated[globalIndex], ...updates };
      return {
        ...prev,
        docs: {
          ...prev.docs,
          [key]: {
            ...prev.docs[key],
            wallpaperParallaxGroups: updated,
          },
        },
      };
    });
  };

  const removeDictionary = (index: number) => {
    setDoc((prev: any) => {
      if (!prev) return prev;
      const key = prev.activeCA;
      const allDicts = prev.docs[key].wallpaperParallaxGroups || [];
      const globalIndex = allDicts.findIndex((d: any, i: number) => d.layerName === transformLayerName && layerDicts.findIndex(ld => ld === d) === index);
      if (globalIndex === -1) return prev;
      const updated = allDicts.filter((_: any, i: number) => i !== globalIndex);
      return {
        ...prev,
        docs: {
          ...prev.docs,
          [key]: {
            ...prev.docs[key],
            wallpaperParallaxGroups: updated,
          },
        },
      };
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">{t("gyroDictionaries")}</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={addDictionary}
            disabled={layerDicts.length >= 10}
          >
            {t("addDictionary")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("dictionaryDescription", { count: layerDicts.length })}
        </p>
      </div>

      {layerDicts.length === 0 ? (
        <div className="border rounded-lg p-4 text-center text-sm text-muted-foreground">
          {t("noDictionariesYet")}
        </div>
      ) : (
        layerDicts.map((dict, index) => (
          <Card key={index} className="p-4 pt-6 relative">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-destructive absolute top-2 right-2"
              onClick={() => removeDictionary(index)}
            >
              <X className="size-4" />
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor={`gyro-title-${index}`}>{t("title")}</Label>
                <Input
                  id={`gyro-title-${index}`}
                  type="text"
                  placeholder={t("tiltEffectPlaceholder")}
                  value={dict.title}
                  onChange={(e) => updateDictionary(index, { title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`gyro-axis-${index}`}>{t("axis")}</Label>
                <Select
                  value={dict.axis}
                  onValueChange={(v) => updateDictionary(index, { axis: v as 'x' | 'y' })}
                >
                  <SelectTrigger className="w-full" id={`gyro-axis-${index}`}>
                    <SelectValue placeholder="Select axis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x">{t("xLeftRight")}</SelectItem>
                    <SelectItem value="y">{t("yUpDown")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`gyro-keypath-${index}`}>{t("keyPath")}</Label>
                <Select
                  value={dict.keyPath}
                  onValueChange={(v) => updateDictionary(index, { keyPath: v as any })}
                >
                  <SelectTrigger className="w-full" id={`gyro-keypath-${index}`}>
                    <SelectValue placeholder={t("selectProperty")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position.x">position.x</SelectItem>
                    <SelectItem value="position.y">position.y</SelectItem>
                    <SelectItem value="transform.translation.x">transform.translation.x</SelectItem>
                    <SelectItem value="transform.translation.y">transform.translation.y</SelectItem>
                    <SelectItem value="transform.rotation.x">transform.rotation.x</SelectItem>
                    <SelectItem value="transform.rotation.y">transform.rotation.y</SelectItem>
                    <SelectItem value="transform.rotation.z">transform.rotation.z</SelectItem>
                    <SelectItem value="anchorPoint.x">anchorPoint.x</SelectItem>
                    <SelectItem value="anchorPoint.y">anchorPoint.y</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`gyro-min-${index}`}>{t("mapMinTo")}</Label>
                <Input
                  id={`gyro-min-${index}`}
                  type="number"
                  step="0.01"
                  placeholder={t("mapMinPlaceholder")}
                  value={dict.mapMinTo}
                  onChange={(e) => updateDictionary(index, { mapMinTo: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  {t("mapMinDescription")}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`gyro-max-${index}`}>{t("mapMaxTo")}</Label>
                <Input
                  id={`gyro-max-${index}`}
                  type="number"
                  step="0.01"
                  placeholder={t("mapMaxPlaceholder")}
                  value={dict.mapMaxTo}
                  onChange={(e) => updateDictionary(index, { mapMaxTo: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  {t("mapMaxDescription")}
                </p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
