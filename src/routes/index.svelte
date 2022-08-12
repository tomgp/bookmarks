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
<header class="box">
<h1>Links</h1>
{#each personalLinksData as link}
  <span class="personal"><a href={link.url}>{link.title}</a></span>
{/each}
</header>
<hr>
<main class="box">
  <section>
    <h2>Articles</h2>
    <p>A collection of archived articles I've read, a traditional link log.</p>
    <ul>
      {#each articles as article}
        <a href="{article["original-url"]}">{article.title} {#if article.author} &mdash; {article.author}{/if}</a> (<a href={article["archive-url"]}>archived {article["archive-date"]}</a>)
        <p class="linkdescription">{article.description}</p>
      {/each}
    </ul>
  </section>
  <section>
    <h2>Directory</h2>
    <p>A collection of websites I think are usefull, interesting or just generally good in some way.</p>
    {#each topTags as tag}
    <div>
      <h2>{tag.name} ({tag.count})</h2>
      <ul>
        {#each linksByTags([tag.name]) as link}
          <li><a href={link.url}>{link.title}</a></li>
          <p class="linkdescription">{link.description}</p>
        {/each}
      </ul>
    </div>
    {/each}
  </section>
</main>
<style>
  h2{
    /* background:black;
    color: white; */
  }
  @media screen and (min-width: 970px) {
    main{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap:var(--s0);
    }
  }
  ul{
    display:block;
  }
  a{
    font-variant: small-caps;
  }
  .linkdescription{
    color: var(--color-medium);
  }
  .personal{
    margin-right:var(--s0);
  }

</style>