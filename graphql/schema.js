const { buildSchema } = require('graphql')

//only login/auth graphql components added. Need Course query and mutation
module.exports = buildSchema(`
    type Course {
        _id: ID!
        courseID: String!
        courseTitle: String!
        courseInstructor: String!
        courseContent: String!
        createdBy: User!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        courses: [Course!]!
    }

    type AuthData{
        token: String!
        userId: String!
    }

    type CourseData {
        courses: [Course!]!
        totalCourses: Int!
    }

    input UserInputData{
        email: String!
        name: String!
        password: String!
    }

    input CourseInputData{
        courseID: String!
        courseTitle: String!
        courseIntructor: String!
        courseContent: String!
        
    }

    type RootQuery{
        login(email: String!, password: String!): AuthData!
        courses: CourseData!
        course(id: ID!): Course!
    }

    type RootMutation{
        createUser(userInput: UserInputData): User!
        createCourse(courseInput: CourseInputData): Course!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
