
// const data = [
//     {
//         _id: 'A',
//         savedBy: '68dea8b13dcd700741c1d79c',
//         savedPost: '690392f2266b2c5801efc8c0',
//         postDetails: {
//             description: "post to test comment cnt 1",
//             images: ['http://res.cloudinary.com/dmqennj82/image/upload/v1761841914/codgiekkybt8dfubjlcc.jpg'],
//             owner: { userName: 's/admin', fullName: 'admin', avatar: 'http://res.cloudinary.com/dmqennj82/image/upload/v1761843503/fu87rv6mhkqozkzacv2a.jpg' },
//             title: "post to test comment cnt 1"
//         },
//     },
//     // {
//     //     _id: 'B',
//     //     savedBy: '68dea8b13dcd700741c1d79c',
//     //     savedPost: '690392f2266b2c5801efc8c0',
//     //     postDetails: {
//     //         description: "post to test comment cnt 1",
//     //         images: ['http://res.cloudinary.com/dmqennj82/image/upload/v1761841914/codgiekkybt8dfubjlcc.jpg'],
//     //         owner: { userName: 's/admin', fullName: 'admin', avatar: 'http://res.cloudinary.com/dmqennj82/image/upload/v1761843503/fu87rv6mhkqozkzacv2a.jpg' },
//     //         title: "post to test comment cnt 1"
//     //     },
//     // }
// ]

// // console.log(data?.[0]?._id)
// data.map((ele) => {
//     console.log(ele._id);
//     console.log(ele.postDetails.description);
// })

const myData = [
    {
        name: "A",
        age: 20,
        _id: 123
    },
    {
        name: "B",
        age: 21,
        _id: 456
    },
    {
        name: "C",
        age: 22,
        _id: 567
    },
]

let ans = myData.filter((item) => (item._id === 123))
console.log(ans);
console.log(ans[0]?._id);
console.log("type", typeof (ans));



// if (myData.filter((item) => (item._id === 123))) {
//     console.log("present");
// } else {
//     console.log("absent");

// }

// if (myData[0].includes({ name: 'A' })) {
//     console.log("present");
// } else {
//     console.log("not");
// }