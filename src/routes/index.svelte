<script>
  import articleData from "../data/article-archive.json";
  import directoryData from "../data/directory.json";
  import personalLinksData from "../data/mobilelinks.json";
  let articles = articleData.sort((a,b)=>{
    return new Date(b["archive-date"]).getTime() - new Date(a["archive-date"]).getTime();
  });
  let tagsDict = {};
  directoryData.forEach(entry => {
    entry.tags.forEach(tag=>{
      if(!tagsDict[tag]){
        tagsDict[tag] = 0;
      }
      tagsDict[tag] += 1;
    });
  });

  let taglist = Object.entries(tagsDict)
    .map(([name, count])=>({name, count}))
    .sort((a,b)=>{
      if(a.name>b.name) return 1;
      if(a.name>b.name) return -1;
      return 0;
    });

  let topTags = taglist
    .filter(t=>t.count>2)
    .sort((a,b)=>{
      return b.count-a.count;
    });

  function linksByTags(tags){
    const links =  directoryData.filter(link=>{
      let tagged = false;
      tags.forEach(tag=>{
        tagged = tagged || (link.tags.indexOf(tag) > -1) 
      });
      return tagged;
    });
    return links;
  }

  console.log(personalLinksData)
</script>
<h1>Links</h1>
<section>
  <h2>Personal</h2>
  <div>
    {#each personalLinksData as link}
      <span class="personal"><a href={link.url}>{link.title}</a></span>
    {/each}
  </div>
</section>
<main>
  <section>
    <h2>Articles</h2>
    <p>This is a collection of archived articles I've read, kind of a traditional link log.</p>
    <ul>
      {#each articles as article}
        <a href="{article["original-url"]}">{article.title} {#if article.author} &mdash; {article.author}{/if}</a> (<a href={article["archive-url"]}>archived {article["archive-date"]}</a>)<p>{article.description}</p>
      {/each}
    </ul>
  </section>
  <section>
    <h2>Directory</h2>
    <p>This is just a collection of websites I think are usefull, interesting or just generally good in some way.</p>
    <div class="taglist box">
      {#each taglist as tag}<span class="tag">{tag.name}</span> <span class="count">({tag.count}) </span>{/each}
    </div>
    {#each topTags as tag}
    <div>
      <h2>{tag.name} ({tag.count})</h2>
      <ul>
        {#each linksByTags([tag.name]) as link}<li><a href={link.url}>{link.title}</a></li>{/each}
      </ul>
    </div>
    {/each}
  </section>
</main>
<style>
  main{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  ul{
    display:block;
  }
  .tag, .count{
    font-family: sans-serif;
    font-size: var(--s-1);
  }
  .personal{
    margin-right: 1rem;
  }
</style>