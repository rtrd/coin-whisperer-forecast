import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, GitFork, GitPullRequest, GitCommit, Code2, Star } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";

interface TokenDeveloperActivityProps {
  tokenInfo?: TokenInfo;
  isLoading?: boolean;
}

export const TokenDeveloperActivity: React.FC<TokenDeveloperActivityProps> = ({
  tokenInfo,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const developerData = tokenInfo?.developer_data;
  
  if (!developerData || !tokenInfo?.links?.repos_url?.github?.[0]) {
    return null;
  }

  // Calculate development health score (0-100)
  const calculateHealthScore = () => {
    const commits = developerData.commit_count_4_weeks || 0;
    const stars = developerData.stars || 0;
    const mergedPRs = developerData.pull_requests_merged || 0;
    const closedIssues = developerData.closed_issues || 0;
    const totalIssues = developerData.total_issues || 1;
    
    const score = Math.min(100, Math.round(
      (commits * 0.3) + 
      (Math.min(stars / 100, 30) * 0.2) + 
      (mergedPRs * 0.3) + 
      ((closedIssues / totalIssues) * 100 * 0.2)
    ));
    
    return score;
  };

  const healthScore = calculateHealthScore();
  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthBadge = (score: number) => {
    if (score >= 70) return { text: "Actively Maintained", variant: "default" as const };
    if (score >= 40) return { text: "Moderate Activity", variant: "secondary" as const };
    return { text: "Low Activity", variant: "destructive" as const };
  };

  const badge = getHealthBadge(healthScore);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Github className="h-5 w-5" />
          Developer Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(healthScore / 100) * 351.86} 351.86`}
                className={getHealthColor(healthScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}
              </span>
              <span className="text-xs text-muted-foreground">Health Score</span>
            </div>
          </div>
          <Badge variant={badge.variant}>{badge.text}</Badge>
        </div>

        {/* GitHub Stats */}
        <div className="grid grid-cols-2 gap-3">
          {developerData.stars !== undefined && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-semibold">{developerData.stars.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Stars</p>
              </div>
            </div>
          )}
          
          {developerData.forks !== undefined && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <GitFork className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-semibold">{developerData.forks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Forks</p>
              </div>
            </div>
          )}
          
          {developerData.pull_requests_merged !== undefined && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <GitPullRequest className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-semibold">{developerData.pull_requests_merged}</p>
                <p className="text-xs text-muted-foreground">Merged PRs</p>
              </div>
            </div>
          )}
          
          {developerData.commit_count_4_weeks !== undefined && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <GitCommit className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-semibold">{developerData.commit_count_4_weeks}</p>
                <p className="text-xs text-muted-foreground">Commits (4w)</p>
              </div>
            </div>
          )}
        </div>

        {/* Code Changes */}
        {developerData.code_additions_deletions_4_weeks && (
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="h-4 w-4 text-foreground" />
              <p className="text-xs text-muted-foreground">Code Changes (4 weeks)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500">
                +{(developerData.code_additions_deletions_4_weeks.additions || 0).toLocaleString()}
              </span>
              <span className="text-red-500">
                -{(developerData.code_additions_deletions_4_weeks.deletions || 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* GitHub Link */}
        <a
          href={tokenInfo.links.repos_url.github[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
        >
          View on GitHub →
        </a>
      </CardContent>
    </Card>
  );
};
