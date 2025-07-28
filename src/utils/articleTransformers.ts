// Article transformation utilities

export interface TransformedArticle {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  url: string;
  content: string;
  tagname: string;
}

export const transformWordPressArticles = (posts: any[]): TransformedArticle[] => {
  return posts.map((post) => {
    const title = post.title?.rendered || "No Title";
    const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
    const date = new Date(post.date).toISOString().split("T")[0];
    const author = post._embedded?.author?.[0]?.name || "Unknown";
    const image =
      post.jetpack_featured_media_url ||
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/300";
    const url = post.link;
    const content = post.content?.rendered || ""; // full HTML content
    const tagname = post.tagNames?.filter((t: string) => t)?.join(", ") || "";

    return {
      id: post.id,
      title,
      excerpt,
      author,
      date,
      category: "Blog",
      readTime: "4 min read",
      image,
      url,
      content,
      tagname,
    };
  });
};