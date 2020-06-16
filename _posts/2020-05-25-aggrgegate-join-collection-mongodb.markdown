```
db.getCollection("plans").aggregate(
    [
        {
            "$match" : {
                "_id" : ObjectId("5ec91e9569c7504a755c4ed5")
            }
        },
        {
            "$lookup" : {
                "from" : "features",
                "localField" : "children",
                "foreignField" : "_id",
                "as" : "features"
            }
        }
    ],
    {
        "allowDiskUse" : false
    }
);
```

ketrangan:

`match` itu kondisi seperti where di sql injection
`$lookup` itu seperti join di sql injection,
penjelasan fiel di dalam `lookup`:
- from adalah collection lain yang akan di join
- localField adalah field di plans yang akan di compare dengan collection features
- foreignField adalah id dari features collection
