const mongoose = require("mongoose");

const { Schema } = mongoose;
//컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체
const Post = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열 배열
  publishedDate: {
    type: Date,
    default: new Date() // 현재 날짜를 기본 값으로 지정
  }
});

module.exports = mongoose.model("Post", Post);

// 첫 번째 파라미터는 스키마 이름이고, 두 번째 파라미터는 스키마 객체(다른스키마에서 참조할때 씀),세 번째 파라미터에 여러분이 원하는 이름(선택)
//스키마 이름을 Post로 설정하면 실제 데이터베이스에 만드는 컬렉션 이름은 posts

// 다른 스키마 내부에 스키마를 내장시킬 수도 있다

// const Author = new Schema({
//   name: String,
//   email: String
// });

// const Book = new Schema({
//   title: String,
//   description: String,
//   authors: [Author],
//   meta: {
//     likes: Number
//   },
//   extra: Schema.Types.Mixed
// });
