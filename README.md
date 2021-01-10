# convert your SQL query for sequelize  


```ts
    // Definition de votre requête
  let conditions: CompleteConditions = [ 
     [
                "Imei",
                "not like",
                "'%33680090%'"
            ],
            "and",
            [
                [
                    "EnrollmentStatus",
                    "=",
                    "Unnrolled"
                ],
                "or",
                [
                    "EnrollmentStatus",
                    "=",
                    "Enrolled"
                ],
            ]
        ]
    ]
```

You can use this module
```ts
  
   import { CompleteConditions , Convert2Sequelize} from "../lib/db-convert";

    const convert = new Convert2Sequelize();
    let whereSequelize = convert.convertToSequelize(conditions);
    //Do something after waiting;
  
    dataModel.findAndCountAll( {
        where: whereSequelize,
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('isLeasing')), 'distinct_Leasing']
        ]
    });

    var query = 'SELECT * From Users ';
    query += ' WHERE ' + convert.convertToSQL(conditions);
    

```


## License

  [MIT](LICENSE)

