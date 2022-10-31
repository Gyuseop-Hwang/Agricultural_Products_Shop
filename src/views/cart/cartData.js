// 목데이터

let products = [
  {
    id: "1",
    name: "감자",
    price: 3000,
    count: 1,
  },
  {
    id: "2",
    name: "토마토",
    price: 6000,
    count: 1,
  },
];

localStorage.setItem("products", JSON.stringify(products));
