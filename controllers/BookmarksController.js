const Repository = require('../models/Repository');
const Controller = require('./Controller');

function checkUrl(string) 
{
    let url;
    
    try 
    {
      url = new URL(string);
    } catch (_) 
    {
      return false;  
    }
  
    return true;
  }

module.exports = 
class BookmarksController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.bookmarksRepository = new Repository('Bookmarks');
    }
    getAll()
    {
        this.response.JSON(this.bookmarksRepository.getAll());
    }

    get(id)
    {
        if(!isNaN(id))
            this.response.JSON(this.bookmarksRepository.get(id));
        else
            this.response.JSON(this.bookmarksRepository.getAll());
    }

    getByName(name)
    {
        this.response.JSON(this.bookmarksRepository.getByName(name));
    }

    getByUsager(usager)
    {
        this.response.JSON(this.bookmarksRepository.getByUsager(usager));
    }

    getByCategory(category)
    {
        this.response.JSON(this.bookmarksRepository.getByCategory(category));
    }

    getNameStartWith(word)
    {
        this.response.JSON(this.bookmarksRepository.getNameStartWith(word.toLowerCase()));
    }

    getParameterOptions()
    {
        let listPossibleParameter = [];
        listPossibleParameter.push("Liste des paramètres disponnible:");
        listPossibleParameter.push("?sort=name");
        listPossibleParameter.push("?sort=category,desc");
        listPossibleParameter.push("?name=name");
        listPossibleParameter.push("?name=ab*");
        listPossibleParameter.push("?category=sport");
        listPossibleParameter.push("?");
        listPossibleParameter.push("/id");
        this.response.JSON(listPossibleParameter);

    }

    getSortByName()
    {
        this.response.JSON(this.bookmarksRepository.getSortByName());
    }

    getSortByNameDesc()
    {
        this.response.JSON(this.bookmarksRepository.getSortByName().reverse());
    }

    getSortByCatDesc()
    {
        this.response.JSON(this.bookmarksRepository.getSortByCat().reverse());
    }

    getSortByCat()
    {
        this.response.JSON(this.bookmarksRepository.getSortByCat());
    }

    getSortByUsager()
    {
        this.response.JSON(this.bookmarksRepository.getSortByUsager());
    }

    getSortByUsagerDesc()
    {
        this.response.JSON(this.bookmarksRepository.getSortByUsager().reverse());
    }

    post(bookmark)
    {  
        console.log("-------------");
        console.log(bookmark.Name);
        console.log(bookmark.Usager);
        console.log(bookmark.Url);
        console.log(checkUrl(bookmark.Url));
        console.log(bookmark.Category);

        //Check name,usager,category & url valide
        if(bookmark.Name == null || bookmark.Usager == null || bookmark.Category == null || checkUrl(bookmark.Url) == false)
        {
            this.response.unprocessable();
        }
        else if(this.bookmarksRepository.getByName(bookmark.Name).length >= 1)
        {
            this.response.conflict();
        }
        else
        {
            let newBookmark = this.bookmarksRepository.add(bookmark);

            if (newBookmark)
            {
                this.response.created(JSON.stringify(newBookmark));
            }  
            else
            {
                this.response.internalError();
            }
        }

    }

    put(bookmark)
    {
        if(bookmark.Name == null || bookmark.Usager == null || bookmark.Category == null || checkUrl(bookmark.Url) == false)
        {
            this.response.unprocessable();
        }
        else if(this.bookmarksRepository.getByName(bookmark.Name).length >= 1)
        {
            this.response.conflict();
        }
        else
        {
            if (this.bookmarksRepository.update(bookmark))
            {
                this.response.ok();
            } 
            else
            {
                this.response.notFound();
            } 
        }

    }

    remove(id)
    {
        if (this.bookmarksRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}