import { Sequelize } from 'sequelize';
import { CompleteConditions , Convert2Sequelize} from "../lib/db-convert";

let conditions1 : CompleteConditions = [
    [
        "Imei",
        "not like",
        "%13%"
    ],
    "and",
    [
        "Imei",
        "not like",
        "%33680090%"
    ],
    "and",
    [
        [
            "EnrollmentStatus",
            "=",
            "Enrolled"
        ],
        "or",
        [
            "EnrollmentStatus",
            "=",
            "Unenrolled"
        ],
        "or",
        [
            [
                "Id",
                "=",
                7
            ],
            "or",
            [
                "Id",
                "=",
                17
            ]
        ]
    ]
];

// let conditions2 = [

//     [
//         [

//             [
//                 "EnrollmentStatus",
//                 "=",
//                 "Enrolled"
//             ],
//             "or",
//             [
//                 "EnrollmentStatus",
//                 "=",
//                 "Unenrolled"
//             ]

//         ]

//     ],
//     "and",
//     [
//         "Imei",
//         "like",
//         "%13%"
//     ],

//     "and",
//     [
//         [
//             "isLeasing",
//             "=",
//             "0"
//         ],
//         "or",
//         [
//             "isLeasing",
//             "=",
//             "1"
//         ]
//     ],
//     "and",
//     [
//         "Platform",
//         "like",
//         "%Appl%"
//     ]
// ]

// conditions = [
//     [ 'id', '>=', '12' ],
//     'and',
//     [ 'Imei', 'like', '354%' ],
//     'and',
//     [ 'lastseen', '>=', '2020-03' ],
//     'and',
//     [
//       [ 'EnrollmentStatus', '=', 'Enrolled' ],
//       'or',
//       [ 'EnrollmentStatus', '=', 'Unenrolled' ]
//     ]
//   ]


//const dbConvert = require('../lib/db-convert');
const convert = new Convert2Sequelize();
var request = {
    where: convert.convertToSequelize(conditions1),
    attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('isLeasing')), 'distinct_Leasing']
    ]
}
var tosequelize = convert.convertToSequelize(conditions1);
console.log('TO SEQUELIZE:',tosequelize);
console.log('\nTO SEQUELIZE DETAIL:')
convert.displayRoot(tosequelize)
console.log('\nSQL:'+convert.convertToSQL(conditions1));


// request = {
//     limit: 10,
//     where: convert.convertToSequelize(conditions1),
//     offset: 0,
// }



