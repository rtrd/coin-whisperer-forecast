interface AdUnitProps {
  type:
    | "header"
    | "sidebar"
    | "square"
    | "mobile"
    | "skyscraper"
    | "leaderboard";
  className?: string;
}

export const AdUnit = (_props: AdUnitProps) => null;

export default AdUnit;
