function buildArticle(article_id)
{
    getArticleInfo(article_id).then(function(article)
    {   
        var article_media = document.getElementById('article_media');
        if(article["TYPE"] == 'video')
        {
            var video = document.createElement('div');
            video.innerHTML = article["MEDIA"];
            article_media.appendChild(video);
        }else
        {
            var img = document.createElement('img');
            img.src = article["MEDIA"];
            img.style.width = '100%';
            article_media.appendChild(img);
        }

        var article_title = document.getElementById('article_title');
        article_title.innerHTML = article["TITLE"];
        
        var article_date = document.getElementById('article_date');
        var date_options = {year: 'numeric', month: 'long', day: 'numeric'};
        article_date.innerHTML = new Date(article["CREATED_ON"]).toLocaleDateString('en-US', date_options);

        var article_text = document.getElementById("article_text");
        article_text.innerHTML = article["TEXT"];
    });
}

function getArticleInfo(article_id)
{
    return new Promise(function(resolve, reject)
    {
        var db = firebase.firestore();
        db.collection("article").doc(article_id).get().then(function(doc)
        {
            var article = {};
            article["TITLE"]        = doc.data().title;
            article["TEXT"]         = doc.data().text;
            article["THUMBNAIL"]    = doc.data().thumbnail;
            article["MEDIA"]        = doc.data().media;
            article["TYPE"]         = doc.data().type;
            article["CREATED_ON"]   = doc.data().created_on;
            resolve(article);
        });
    })
}

function buildMainArticleTile(article_container_id, doc)
{
    var article_container = document.getElementById(article_container_id);
    var card = document.createElement('a');
    card.href = '/article.html?id='+doc.id;
    card.style.paddingLeft = '0px';
    card.className = 'card'
    var article_thumbnail = document.createElement('img');
    article_thumbnail.style.width = '100%';
    article_thumbnail.src = doc.data().thumbnail;
    card.appendChild(article_thumbnail);
    var info_wrapper = document.createElement('div');
    info_wrapper.className = 'article_info_wrapper';

    var date_div = document.createElement('div');
    date_div.className = 'miniCardDate';
    var date_options = {year: 'numeric', month: 'long', day: 'numeric'};
    date_div.innerHTML = new Date(doc.data().created_on).toLocaleDateString('en-US', date_options);
    info_wrapper.appendChild(date_div);
    var description_div = document.createElement('div');
    description_div.className = 'description';
    var description = document.createElement('a');
    description.href='/article.html?id='+doc.id;
    description.innerHTML = doc.data().title; 
    description_div.appendChild(description);
    info_wrapper.appendChild(description_div);
    card.appendChild(info_wrapper);
    article_container.appendChild(card);


}

function buildArticleTile(article_container_id, doc)
{
    var article_container = document.getElementById(article_container_id);
    var card = document.createElement('a');
    card.href='/article.html?id='+doc.id;
    card.style.paddingLeft = '0px';
    card.className = 'containerItem'
    var article_thumbnail = document.createElement('img');
    article_thumbnail.style.width = '100%';
    article_thumbnail.src = doc.data().thumbnail;
    card.appendChild(article_thumbnail);
    var date_div = document.createElement('div');
    date_div.className = 'miniCardDate';
    var date_options = {year: 'numeric', month: 'long', day: 'numeric'};
    date_div.innerHTML = new Date(doc.data().created_on).toLocaleDateString('en-US', date_options);
    card.appendChild(date_div);
    var description_div = document.createElement('div');
    description_div.className = 'miniCardDescription';
    var description = document.createElement('a');
    description.href='/article.html?id='+doc.id;
    description.innerHTML = doc.data().title; 
    description_div.appendChild(description);
    card.appendChild(description_div);
    article_container.appendChild(card);
}

