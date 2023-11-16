import {useEffect, useState} from "react";
import {FaHeart} from "react-icons/fa";
import "./App.css";

// 좋아요 기능을 넣기위한 고민..
// 방법 1) likeIds라는 state를 선언해서 좋아요가 눌린 id를 저장해서 좋아요가 눌린 곡을 구분한다.
//        단점:
//        추가 계산 필요: UI를 렌더링할 때, 각 곡이 좋아요된 상태인지 확인하기 위해 likeIds 배열을 매번 확인해야 합니다.
//        상태 동기화: 좋아요 상태와 차트 데이터가 분리되어 있기 때문에, 두 상태 간 동기화를 신경 써야 합니다.
// 방법 2) melonChart의 각 곡에 isLike라는 프로퍼티를 추가해서 좋아요가 눌린 곡을 구분한다.
//        단점: 좋아요 상태를 변경할 때마다 전체 차트 데이터를 업데이트해야 합니다

// 원하는 것: api를 호출해서 데이터를 받아와서 state로 선언된 items에 담아서 사용하기.
//    -> api 호출은 어느시점에? 로딩되자마자.(아무것도 누르지 않아도 로딩 되자마자!!!!)

// use- : 훅이다. 함수형 컴포넌트에서 사용하려고 만든 것임. -> 클래스형 컴포넌트 X

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [items, setItems] = useState([]);
  // melonChartItems.map((item) => ({ ...item, isLike: false }))

  function handleLike(index) {
    const newItems = [...items];
    newItems[index].isLike = true;
    setItems(newItems);
  }

  function handleRemoveLike(index) {
    const newItems = [...items];
    newItems[index].isLike = false;
    setItems(newItems);
  }

  console.log("123");

  // 렌더링: 초기렌더링 -> 리렌더링 -> 종료될 때...
  useEffect(() => {
    setIsLoading(true);
    fetch("https://api-ex.vercel.app/api/getMelonChart")
      .then((res) => res.json())
      .then((res) => {
        setItems(res.melonChart); // state가 바뀜 -> 컴포넌트 리렌더링 -> useEffect의 [] 빈배열을 넘겨주는 이곳 safe zone에서는 다시 실행이 되지 않음.

        setIsError(false);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  return (
    <>
      <div>
        <div style={{display: "flex", justifyContent: "flex-start"}}>
          <img width="142" height="99" src="https://cdnimg.melon.co.kr/resource/image/web/common/logo_melon142x99.png" alt="Melon" />
        </div>
        {isError && <div>에러 발생!!!!</div>}
        {isLoading && <div>로딩 중..</div>}
        {!isLoading && (
          <table style={{borderCollapse: "separate", borderSpacing: 20}}>
            <thead>
              <tr>
                <th style={commonStyle.tableHead}>순위</th>
                <th></th>
                <th style={commonStyle.tableHead}>곡정보</th>
                <th style={commonStyle.tableHead}>앨범</th>
                <th style={commonStyle.tableHead}>좋아요</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <div
                        style={{
                          color: "#333",
                          fontSize: 18,
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: "500",
                        }}
                      >
                        {item.rank}
                      </div>
                    </td>
                    <td>
                      <img
                        style={{
                          width: 60,
                          height: 60,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                        src={item.thumbnailUrl}
                        alt={item.title}
                      />
                    </td>
                    <td style={{width: 250}}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{color: "#333", fontSize: 14}}>{item.title}</div>
                        <div style={{color: "#969696", fontSize: 12}}>{item.artist}</div>
                      </div>
                    </td>
                    <td style={{width: 150}}>
                      <div style={{color: "#969696", fontSize: 14}}>{item.albumName}</div>
                    </td>
                    <td>
                      <div
                        onClick={() => {
                          if (item.isLike) {
                            handleRemoveLike(index);
                          } else {
                            handleLike(index);
                          }
                        }}
                      >
                        {item.isLike && <FaHeart color="#fe3d3d" />}
                        {!item.isLike && <FaHeart color="#e0dfdf" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const commonStyle = {
  tableHead: {textAlign: "left", fontSize: 13, color: "#606060"},
};

export default App;
