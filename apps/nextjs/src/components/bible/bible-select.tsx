import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lamp/ui/select";

import { BIBLE_VERSIONS } from "~/lib/constants";
import { useBibleStore } from "~/providers/bible-store-provider";

export function BibleSelect() {
  const setBibleVersion = useBibleStore((state) => state.setBibleVersion);

  return (
    <Select
      defaultValue="BSB"
      onValueChange={(value) => setBibleVersion(value as "BSB" | "KJV")}
    >
      <SelectTrigger aria-label="Select Bible version" className="pl-2 pr-1">
        <SelectValue placeholder="Select version" />
      </SelectTrigger>
      <SelectContent>
        {BIBLE_VERSIONS.map((version) => (
          <SelectItem
            key={version.value}
            value={version.value}
            disabled={version.disabled}
          >
            {version.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
