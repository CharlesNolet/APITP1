
const fs = require('fs');
const { get } = require('http');

function compareName( obj1, obj2 ) 
{
    if ( obj1.Name < obj2.Name )
    {
      return -1;
    }
    if ( obj1.Name > obj2.Name )
    {
      return 1;
    }

    return 0;
}

function compareCategory( obj1, obj2 ) 
{
    if ( obj1.Category < obj2.Category )
    {
      return -1;
    }
    if ( obj1.Category > obj2.Category )
    {
      return 1;
    }

    return 0;
}

function compareUsager( obj1, obj2 ) 
{
    if ( obj1.Usager < obj2.Usager )
    {
      return -1;
    }
    if ( obj1.Usager > obj2.Usager )
    {
      return 1;
    }

    return 0;
}

///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    get(id)
    {
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }
    getByName(name)
    {
        let byNameList = [];

        for(let object of this.objectsList){
            if (object.Name.toLowerCase() === name.toLowerCase()) {
               byNameList.push(object);
            }
        }
        return byNameList;
    }

    getByUsager(usager)
    {
        let byUsagerList = [];

        for(let object of this.objectsList){
            if (object.Usager.toLowerCase() === usager.toLowerCase()) {
               byUsagerList.push(object);
            }
        }
        return byUsagerList;
    }

    getByCategory(category)
    {
        let byCategoryList = [];
        console.log("Over here:" + category);
        for(let object of this.objectsList)
        {
            if (object.Category.toLowerCase() === category.toLowerCase()) 
            {
               byCategoryList.push(object);
            }
        }
        return byCategoryList;
    }

    getNameStartWith(word)
    {
        let byNameList = [];

        for(let object of this.objectsList)
        {
            if (object.Name.toLowerCase().startsWith(word)) {
               byNameList.push(object);
            }
        }

        return byNameList;
    }

    getSortByName()
    {
        let returnList = this.objectsList;

        return returnList.sort(compareName);
    }

    getSortByCat()
    {
        let returnList = this.objectsList;

        return returnList.sort(compareCategory);
    }

    getSortByUsager()
    {
        let returnList = this.objectsList;

        return returnList.sort(compareUsager);
    }

    remove(id) 
    {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    update(objectToModify) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
}