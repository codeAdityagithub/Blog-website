import posts from "../models/post.js";
import { singleton } from "../utils/singleton.js";

const cache = singleton("serverCache", () => new Map());

function cacheget(duration) {
  if (cache.size == 0) {
    return null;
  }
  const data = {
    Latestpost: cache.get("latest"),
    Popularpost: cache.get("popular"),
    Trending: cache.get("trending"),
  };
  return data;
}
function cacheset(latest, popularpost, trending) {
  cache.set("latest", latest);
  cache.set("trending", trending);
  cache.set("popular", popularpost);
}

async function getAllBlogs() {
  const LatestPro = posts.find({}).sort({ createdAt: -1 }).limit(10);
  const Popularpro = posts.find({}).sort({ views: -1 }).limit(10);
  const TrendingPro = posts.find({}).sort({ likes: -1, views: -1 }).limit(10);

  const [popular, latest, trending] = await Promise.all([
    LatestPro,
    Popularpro,
    TrendingPro,
  ]);

  return { popular, latest, trending };
}

export async function getCachedBlogs() {
  //   const cached = cacheget();
  //   if (cached) {
  //     return cached;
  //   }
  const { latest, popular, trending } = await getAllBlogs();
  cacheset(latest, popular, trending);
  return { Popularpost: popular, Latestpost: latest, Trending: trending };
}
