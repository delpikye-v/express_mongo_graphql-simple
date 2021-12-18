
const graphql = require('graphql');
const Todo = require('../models/Todo');

const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLList, GraphQLSchema } = graphql

const TodoQuery = new GraphQLObjectType({
    name: "Todo",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
    })
});


const queryName = {
    list: 'list_todo',
    create: 'create_todo',
    update: 'update_todo',
    delete: 'delete_todo',
    get: 'get_id'
}

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        [queryName.list]: {
            type: new GraphQLList(TodoQuery),
            resolve() {
                return Todo.find()
            }
        },

        [queryName.get]: {
            type: TodoQuery,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Todo.findById(args.id)
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // create_todo(name:"todo", ...)
        [queryName.create]: {
            type: TodoQuery,
            args: {
                name: {
                    type: GraphQLString
                },
                description: {
                    type: GraphQLString
                },
                completed: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, agrs) {
                let todo = new Todo({
                    name: agrs.name,
                    description: agrs.description,
                    completed: agrs.completed
                })
                return todo.save()
            }
        },

        // update_todo(id: "61b48f7f6c0e22268deaaf98", name:"todo")
        [queryName.update]: {
            type: GraphQLBoolean,
            args: {
                id: {
                    type: GraphQLID
                },
                name: {
                    type: GraphQLString
                },
                description: {
                    type: GraphQLString
                },
                completed: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, args) {
                let { id, name, description, completed } = args
                let changeData = { name, description, completed }
                return new Promise((resolve, reject) => {
                    Todo.findOneAndUpdate({ _id: id }, changeData).exec((err, res) => {
                        if (err) {
                            reject(false)
                        } else {
                            resolve(true)
                        }
                    })
                })
            }
        },

        //   # delete_todo(id:"61b48f036c0e22268deaaf96")
        [queryName.delete] : {
            type: GraphQLBoolean,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    Todo.find({  _id: args.id }).remove().exec((err, res) => {
                        if (err) {
                            resolve(false)
                        } else {
                            let { deletedCount } = res
                            resolve(deletedCount !== 0)
                        }
                    });
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})