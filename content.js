let diaryItems = [];

//1.크롬 스토리지에서 데이터 불러오는 함수 선언
function getDiaryItems() {
  //2.크롬스토리지 데이터 가져오기
  chrome.storage.local.get("diary", (result) => {
    if (result.diary) {
      console.log("성공", result.diary);
      diaryItems = result.diary;
      //forEach()
      //배열의 개수만큼 반복실행
      diaryItems.forEach((item) => {
        //item => diary{}(다이어리 객체)
        //1. li태그 만들기
        const $li = $("<li>");
        //1.속성의 이름
        //2.속성의 값
        $li.attr("id", item.id);

        //2.p 태그 만들기
        const $p = $("<p>");
        //p태그안데 작성한 내용 넣기
        $p.text(`${item.date} ${item.text}`);
        //삭제 버튼 생성
        const $removeBut = $("<button>");
        $removeBut.text("삭제");
        //삭제 이벤트 등록
        $removeBut.on("click", function () {
          $(this).parent().remove();
          const id = $(this).parent().attr("id");
          let newDiaryItem = diaryItems.filter((item) => {
            return item.id != id;
          });

          diaryItems = newDiaryItem;

          chrome.storage.local.set({ diary: newDiaryItem }, () => {
            console.log("데이터 저장 성공");
          });
        });

        //li요소에 P버튼추가
        $li.append($p);
        $li.append($removeBut);
        // 리스트에 li요소 추가
        $(".diary-list").append($li);
      });
    } else {
      console.log("데이터 없음");
    }
  });
}

// 제이쿼리 불러오기
$(function () {
  // dialog 모달창 띄우기
  // console.log("제이쿼리 성공");
  //데이터를 불러오는 함수 호출
  getDiaryItems();
  //1. add-btn 태그 가져오기
  //2. 클릭이벤트 등록
  $(".add-btn").on("click", () => {
    let modal = $("#modal");
    // console.log(modal);
    // <dialog>
    // showModal() 메서드 : dialog태그 화면에 표시
    modal[0].showModal();
  });

  //overlay 클릭시 모달 닫기
  $("#modal").on("click", function (e) {
    let modal = $("#modal");
    // console.log(modal);
    // <dialog>
    // close() 메서드 : dialog태그 종료

    // 이벤트가 발생한 요소가 #modal일 경우
    // 모달창 종료
    //
    if (e.target === this) {
      // console.log(this);
      modal[0].close();
    }
  });

  //폼 제출 이벤트로 데이터 가져오기
  $("#modal form").on("submit", () => {
    //1.textArea태그에 적은 값 가져오기
    const diaryText = $("#modal textarea").val();

    //2.현재 날짜를 가져오기
    const formatDate = dayjs().format("YYYY년MM월DD일");
    // console.log(diaryText, formatDate);

    //1.diary데이터 객체화
    const diary = {
      date: formatDate,
      text: diaryText,
      id: Date.now() + "",
    };
    //배열에 새로 생선되 diary 객체 넣기
    diaryItems.push(diary);

    chrome.storage.local.set({ diary: diaryItems }, () => {
      console.log("데이터 저장 성공");
    });
    //1. li태그 만들기
    const $li = $("<li>");
    //1.속성의 이름
    //2.속성의 값
    $li.attr("id", diary.id);

    //2.p 태그 만들기
    const $p = $("<p>");
    //p태그안데 작성한 내용 넣기
    $p.text(`${diary.date} ${diary.text}`);
    //삭제 버튼 생성
    const $removeBut = $("<button>");
    $removeBut.text("삭제");
    //삭제 이벤트 등록
    $removeBut.on("click", function () {
      $(this).parent().remove();
      const id = $(this).parent().attr("id");
      let newDiaryItem = diaryItems.filter((item) => {
        return item.id != id;
      });

      diaryItems = newDiaryItem;

      chrome.storage.local.set({ diary: newDiaryItem }, () => {
        console.log("데이터 저장 성공");
      });
    });

    //li요소에 P버튼추가
    $li.append($p);
    $li.append($removeBut);
    // 리스트에 li요소 추가
    $(".diary-list").append($li);

    //text 내용비우기
    $("#modal textarea").val("");
  });
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
  const crd = pos.coords;

  let latitude = crd.latitude;
  let longitude = crd.longitude;
  let apikey = "8db55fc21a695d9d1bc4a050faaa8af9";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric&lang=kr`
    );
    const data = await response.json();
    const weather = data.weather[0].description;
    const icon = data.weather[0].icon;
    const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    console.log(weather);
    const temp = Math.round(date.main.temp);
    console.log(temp);
    $(".weather").text(`${weather} ${temp}℃`);
    $(".weather-icon").attr("src", imageUrl);
  } catch (error) {
    console.log(error.message);
  }

  // .then((response) => {
  //   console.log(response);
  //   return response.json();
  // })
  // .then((date) => {
  //   console.log(date);
  //   const weather = date.weather[0].description;
  //   const icon = date.weather[0].icon;
  //   const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  //   console.log(weather);
  //   const temp = Math.round(date.main.temp);
  //   console.log(temp);
  //   $(".weather").text(`${weather} ${temp}℃`);
  //   $(".weather-icon").attr("src", imageUrl);
  // });

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error);
