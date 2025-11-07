import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, MessageCircle, Users, Github, TrendingUp } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";

interface TokenSocialHubProps {
  tokenInfo?: TokenInfo;
  isLoading?: boolean;
}

export const TokenSocialHub: React.FC<TokenSocialHubProps> = ({ tokenInfo, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const communityData = tokenInfo?.community_data;
  const hasTwitter = tokenInfo?.links?.twitter_screen_name;
  const hasWebsite = tokenInfo?.links?.homepage?.[0];
  const hasReddit = tokenInfo?.links?.subreddit_url;
  const hasTelegram = communityData?.telegram_channel_user_count;
  const hasGithub = tokenInfo?.links?.repos_url?.github?.[0];

  // Calculate social volume spike (mock)
  const socialVolumeSpike = Math.random() > 0.7;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Community & Social
          </CardTitle>
          {socialVolumeSpike && (
            <Badge variant="default" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Social Links */}
        <div className="grid grid-cols-2 gap-3">
          {hasTwitter && (
            <Button
              variant="outline"
              className="justify-start gap-2"
              asChild
            >
              <a
                href={`https://twitter.com/${tokenInfo.links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4 text-blue-500" />
                <span className="flex-1 text-left">Twitter</span>
                {communityData?.twitter_followers && (
                  <span className="text-xs text-muted-foreground">
                    {(communityData.twitter_followers / 1000).toFixed(0)}K
                  </span>
                )}
              </a>
            </Button>
          )}

          {hasWebsite && (
            <Button
              variant="outline"
              className="justify-start gap-2"
              asChild
            >
              <a
                href={tokenInfo.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span className="flex-1 text-left">Website</span>
              </a>
            </Button>
          )}

          {hasReddit && (
            <Button
              variant="outline"
              className="justify-start gap-2"
              asChild
            >
              <a
                href={tokenInfo.links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-orange-500" />
                <span className="flex-1 text-left">Reddit</span>
                {communityData?.reddit_subscribers && (
                  <span className="text-xs text-muted-foreground">
                    {(communityData.reddit_subscribers / 1000).toFixed(0)}K
                  </span>
                )}
              </a>
            </Button>
          )}

          {hasGithub && (
            <Button
              variant="outline"
              className="justify-start gap-2"
              asChild
            >
              <a
                href={tokenInfo.links.repos_url.github[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 text-foreground" />
                <span className="flex-1 text-left">GitHub</span>
              </a>
            </Button>
          )}
        </div>

        {/* Community Stats */}
        {communityData && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            {communityData.reddit_subscribers && (
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {(communityData.reddit_subscribers / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">Reddit Subscribers</p>
              </div>
            )}
            
            {communityData.reddit_accounts_active_48h && (
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-green-500">
                  {communityData.reddit_accounts_active_48h.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Active Users (48h)</p>
              </div>
            )}
            
            {hasTelegram && (
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {(communityData.telegram_channel_user_count / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">Telegram Members</p>
              </div>
            )}
          </div>
        )}

        {/* Sentiment Gauge */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-semibold mb-3 text-foreground">Social Sentiment</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500">Bullish</span>
              <span className="text-green-500 font-semibold">68%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: "68%" }} />
            </div>
            
            <div className="flex items-center justify-between text-sm mt-3">
              <span className="text-red-500">Bearish</span>
              <span className="text-red-500 font-semibold">32%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600" style={{ width: "32%" }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
