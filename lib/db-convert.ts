import { Op } from 'sequelize';

export interface IOperators {
    [index: string]: symbol
}

type IOrAnd = "or" | "and" ;
interface ISimpleCondition {
    0: string | number;
    1: string | number;
    2: string | number;
}

export type ITabSimpleConditions = (ISimpleCondition |IOrAnd|CompleteConditions)[];
export type CompleteConditions = (ISimpleCondition | IOrAnd | ITabSimpleConditions)

export class Convert2Sequelize {
    private fc: IOrAnd = "and";
    private sc: ISimpleCondition = [
        "Imei",
        "not like",
        13
    ];

    conditions: CompleteConditions = [
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
                "dEnrolled"
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
            ]
        ]
    ];

    constructor() {

    }

    private static IS_NULL = Symbol("ISNULL");
    private static IS_NOT_NULL = Symbol("ISNOTNULL");

    private static tabConvertOperator: IOperators = {
        "and": Op.and,
        "or": Op.or,
        "=": Op.eq,
        "!=": Op.ne,
        ">": Op.gt,
        "<": Op.lt,
        '>=': Op.gte,
        '<=': Op.lte,
        "like": Op.like,
        "not like": Op.notLike,
        "ilike": Op.iLike,
        "not ilike": Op.notILike,
        "regex": Op.regexp,
        "notRegexp": Op.notRegexp,
        "iregex": Op.iRegexp,
        "not iregex": Op.notIRegexp,
        "startswith": Op.startsWith,
        "endswith": Op.endsWith,
        "contains": Op.contains,
        "isnull": Convert2Sequelize.IS_NULL,
        "isnotnull": Convert2Sequelize.IS_NOT_NULL

    }

    /**
     * Retour les operateurs disponibles
     *
     * @return {*}  {IOperators}
     * @memberof Convert2Sequelize
     */
    getOperators(): IOperators {
        return Convert2Sequelize.tabConvertOperator;
    }

    /**
     * Permet de retourner le symbol associé à l'opération souhaité
     * Exemple: '=' retourne Op.eq
     *
     * @param {string} op
     * @return {*}  {symbol}
     * @memberof Convert2Sequelize
     */
    convOperator(op: string): symbol {
        if (!Convert2Sequelize.tabConvertOperator[op]) {
            throw ("Op " + op.toString() + " could not be used!!!!!!:");
        }
        return Convert2Sequelize.tabConvertOperator[op];
    }

    /**
     * Retourne l'équivalent SQL à partir d'une condition formalisée sous cette forme:
         * 
         * [ 
         *  [
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
     
     *
     * @param {[]} conditions
     * @return {*}  {string}
     * @memberof DBConvert
     */
    convertToSQL(conditions: CompleteConditions): string {
        var sql = '';
        var makeSQL = function (d) {
            if (typeof (d) == 'string') {
                sql += d;
                //console.log('SQL 1'+sql)
            } else {
                if (d.length == 3 &&
                    (typeof (d[1]) == 'string' || typeof (d[1]) == 'number') &&
                    (typeof (d[2]) == 'string' || typeof (d[2]) == 'number') &&
                    (typeof (d[0]) == 'string' || typeof (d[0]) == 'number')) {
                    if (d[1] == 'isnull') {
                        sql += ' ( ' + d[0] + ' is null ) ';
                    } else if (d[1] == 'isnotnull') {
                        sql += ' ( ' + d[0] + ' is not null ) ';
                    } else if (d[1] == 'startswith') {
                        sql += ' ( ' + d[0] + ' like \'' + d[2] + '%\' ) ';
                    } else if (d[1] == 'endswith') {
                        sql += ' ( ' + d[0] + ' like \'%' + d[2] + '\' ) ';
                    } else if (d[1] == 'contains') {
                        sql += ' ( ' + d[0] + ' like \'%' + d[2] + '%\' ) ';
                    } else {
                        if (typeof (d[2]) == 'number') {
                            sql += ' ( ' + d[0] + ' ' + d[1] + ' ' + d[2] + ' ) ';
                        } else {
                            sql += ' ( ' + d[0] + ' ' + d[1] + ' \'' + d[2] + '\' ) ';
                        }

                    }

                    // console.log('SQL 2' + sql)
                } else {
                    // console.log('SQL 3', d);
                    if (!d.length) {
                        console.log('SQL 3', d);
                        throw ("YY")
                    }
                    sql += ' ( '
                    d.forEach(makeSQL);
                    sql += ' ) '
                }
            }
        }

        let d = conditions as [];
        d.forEach(makeSQL);
        // console.log("FINAL SQL", sql);
        return sql;
    }

    /**
     * Retourne l'expression where qui peut être utilisée par sequelize
     * à partir d'une condition formalisée sous cette forme:
     * 
     * [
            "Imei",
            "not like",
            "'%33680090%'"
        ],
        "and",
        [
            [
                "EnrollmentStatus",
                "=",
                "dEnrolled"
            ],
            "or",
            [
                "EnrollmentStatus",
                "=",
                "Unenrolled"
            ]
        ]
     
     * @param {[]} conditions
     * @return {*}  {*}
     * @memberof DBConvert
     */
    convertToSequelize(conditions: CompleteConditions): any {

        var convOp = this.convOperator;
        var makeSequelize = function (d, root: any = null, lastOpToPush: any = null) {
            // console.log('makeSequelize',d)
            if (d.length == 3 && (typeof (d[0]) == 'string' || typeof (d[0]) == 'number')
                && (typeof (d[1]) == 'string' || typeof (d[1]) == 'number')
                && (typeof (d[2]) == 'string' || typeof (d[2]) == 'number')
            ) {
                let o = {}
                o[d[0]] = {}
                if (d[1] == 'isnull') {
                    o[d[0]][convOp('=')] = null;
                } else if (d[1] == 'isnotnull') {
                    o[d[0]][convOp('!=')] = null;
                } else {
                    // if (d[2] === '{NULL_VALUE}') {
                    //     o[d[0]][convOp(d[1].toString())] =  null;
                    // } else {
                    o[d[0]][convOp(d[1].toString())] = d[2];
                    //}
                }
                //console.log('\nPUSH (1) +++++ ', o);
                lastOpToPush.push(o);

            } else {
                // console.log('\nSEQUELIZE (III)', d);
                var hasSubCondition = false;
                if (typeof (d) == 'object' && d.length > 0) {
                    hasSubCondition = d.find(n => typeof (n) == 'object');
                }
                if (hasSubCondition) {
                    if (root == null) {
                        // console.log('create EMPTY lastOpToPush  ====================== ');
                        root = {};
                    } else {
                        if (lastOpToPush) {
                            // console.log('create EMPTY lastOpToPush  ====================== ');
                            root = {};
                        } else {
                            throw ('Unexpected status in makeSequelize()');
                        }
                    }
                }
                // console.log("hasSubCondition", hasSubCondition)
                if (d.length > 0) {
                    var lastOp = root;
                    for (var n = 0; n < d.length; n++) {
                        if (n == 0) {
                            var op = 'and';
                            if (d.length > 1) {
                                op = d[1];
                            }
                            root[convOp(op)] = [];
                            lastOp = root[convOp(op)];
                            // console.log('\lastOp (0) =', d[n]);
                        }
                        if (typeof (d[n]) == 'string') {
                            //  console.log('\lastOp (1) ==', d[n]);
                            if (!root[convOp(d[n])]) {
                                root[convOp(d[n])] = [];
                                // console.log('\ncreate root' + d[n]);
                            }
                            lastOp = root[convOp(d[n])];
                        } else {
                            // console.log('\nSEQUELIZE (2,2)  ',  d[n]);
                            makeSequelize(d[n], root, lastOp);
                        }

                    }
                    if (lastOpToPush) {
                        lastOpToPush.push(root);
                    }
                } else {
                    throw ("Missing array in conditions")
                }
            }
            return root;

        }
        return makeSequelize(conditions);

    }

    displayAndorOr(r: any) {
        if (r && r[Op.and]) {
            console.log('AND', r[Op.and]);
            return r[Op.and];
        } else {
            if (r && r[Op.or]) {
                console.log('OR', r[Op.or]);
                return r[Op.or];
            }
        }
        return r;
    }

    displayRoot(root: any) {
        console.log('displayRoot ========= ', root);
        console.log('root.length ' + root.length);
        var fct = function (r, level: number) {
            var op = '';
            if (r[Op.and]) {
                r = r[Op.and];
                op = 'and';
            }
            if (r[Op.or]) {
                r = r[Op.or];
                op = 'or';
            }
            //console.log("LEVEL["+level+']:')
            var s = '   ';
            for (var i = 0; i < level; i++) {
                s += '   ';
            }

            for (let element of r) {
                if (typeof (element) == 'object') {
                    console.log(s + op + ' =>(' + level + ')', element);
                    fct(element, level + 1)
                }
                // console.log(typeof(element) +'(type)',element);
            };
            //console.log(' ');
        }
        fct(root, 0)

    }

}
