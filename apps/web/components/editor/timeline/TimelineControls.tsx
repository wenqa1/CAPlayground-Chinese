import { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import Timeline from "./Timeline";
import { useTimeline } from "@/context/TimelineContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function TimelineControls() {
  const { t } = useTranslations("timeline");
  const { isPlaying, pause, play, setTime, currentTime } = useTimeline();
  const [showTimeline, setShowTimeline] = useState(false);
  const ArrowComponent = showTimeline ? ChevronDown : ChevronUp;
  return (
    <>
      {showTimeline && (
        <Timeline />
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 shadow-sm">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => isPlaying ? pause() : play()}
        >
          {isPlaying ? t("pause") : t("play")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setTime(0)}
        >
          {t("restart")}
        </Button>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2" onClick={() => setShowTimeline((v: boolean) => !v)} >
              <div className="text-xs tabular-nums px-2">{`${(currentTime / 1000).toFixed(2)}s`}</div>
              <ArrowComponent className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>{showTimeline ? t("hideTimeline") : t("showTimeline")}</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}