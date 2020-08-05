const { fetchItem, fetchTopStories } = require("./../../utils/api/hn");

module.exports = async (parent, args, ctx, info) => {
  const { page } = args;

  const ids = await fetchTopStories();

  const stories = [];
  const elementsPerPage = 20;

  let arr = [];
  if (page) {
    arr = ids.slice((page - 1) * elementsPerPage, page * elementsPerPage);
  } else {
    arr = ids;
  }

  for (let id of arr) {
    stories.push(await fetchItem(id));
  }

  const raw = await Promise.all(stories);

  return raw.map((each, key) => ({
    rawId: (page - 1) * elementsPerPage + (key + 1),
    id: each.id,
    type: each.type || "story",
    deleted: each.deleted || false,
    time: each.time || "",
    text: each.text || "N/A",
    dead: each.dead || false,
    url: each.url || "",
    score: each.score || 0,
    title: each.title || "",
    by: each.by || "",
    kids: each.descendants > 0 ? each.kids : [],
  }));
};
