const Question = require('../models/Question')
const Selection = require('../models/Selection')

exports.showUnansweredByUser = async (req, res, next) => {

    const user_id = req.params.user_id;

    try {
        const questionIds = await Selection.aggregate(
            [
                {
                    $match: {
                        "user_id": user_id
                    }
                },
                {
                    $unset: [
                        "user_id",
                        "selected_answer",
                        "_id",
                        "__v"
                    ]
                },
                {
                    $group: {
                        "_id": "",
                        "question_id": {
                            $push: "$question_id"
                        }
                    }
                }
            ]
        )
        const idsArray = questionIds[0].question_id;


        const unansweredQuestions = await Question.aggregate(
            [
                {
                        $addFields: { _id: { $toString: "$_id" }}
                },
                {
                        $match: { _id: { $nin: idsArray}}
                }
                ])
        res.json(unansweredQuestions)

    } catch {
        const unansweredQuestions = await Question.find()
        res.json(unansweredQuestions)
    }
}

exports.showAnsweredByUser = async (req, res, next) => {

    const user_id = req.params.user_id;

    try {
        const questionIds = await Selection.aggregate(
            [
                {
                    $match: {
                        "user_id": user_id
                    }
                },
                {
                    $unset: [
                        "user_id",
                        "selected_answer",
                        "_id",
                        "__v"
                    ]
                },
                {
                    $group: {
                        "_id": "",
                        "question_id": {
                            $push: "$question_id"
                        }
                    }
                }
            ]
        )
        const idsArray = questionIds[0].question_id
        const answeredQuestions = await Question.find({"_id": idsArray})
        res.json(answeredQuestions);
    } catch (err){
        res.json({message: "show by user is not working"});
    }
}
