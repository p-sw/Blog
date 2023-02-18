# SSerVe's Devlog
[SSerVe's Devlog](https://blog.sserve.work) 블로그의 레포지토리입니다.

## 개발 환경
### 언어
Python 3.11.1 & NodeJS v18.13.0  
### 프레임워크
- Python Environment - Pipenv
- Backend - FastAPI
- Frontend - NextJS

## 개발 시
- Backend와 Frontend는 localhost에서 통신하기 때문에, 반드시 같은 환경에서 실행되어야 합니다.
- SQLite3 데이터베이스를 쓰고 있으며, 컨텐츠 서버를 따로 구축해 (https://cdn.sserve.work) 업로드 시 토큰을 주도록 설계되어 있습니다.

### 실행
- Frontend
  + 실행 시 환경변수로 API_KEY를 넘겨주고, 컨텐츠 서버에 업로드를 시도 할 때 Header로 API_KEY를 전송, 인증을 시도합니다.
- Backend
  + Pipenv를 사용했기 때문에 다음과 같은 절차가 필요합니다.
    1. `pip install pipenv` - 전역으로 pipenv 설치
    2. `cd Blog` - 레포지토리 루트 폴더로 이동
    3. `pipenv install` - virtualenv 생성 & 종속성 설치
    4. `pipenv shell` - pipenv의 virtualenv 실행
  + 이후 virtualenv 안에서 `python main.py`를 입력하여 실행을 시도할 수 있습니다.
  + 환경변수로는 ADMIN_ID와 ADMIN_PW를 받고, `/admin/login` 루트에서 로그인 등을 시도할 때 인증을 위해 사용합니다.
  + 로그 설정 파일은 Dev와 Prod 환경에 맞게 따로 구성되어 있습니다.
  + 실행 시 `--reload` 옵션을 줌으로서 백엔드 파일의 변화를 감지해 빠르게 재시작할 수 있습니다.
  + 실행 시 `--log-config devlog.ini` 옵션을 줌으로서 Dev 환경의 로그 설정을 적용할 수 있습니다.

## 배포
Docker와 Nginx를 활용하는 것을 권장합니다.

## Todo List

- [X] 메인 검색 기능
- [X] 메인 페이지 넘기기 기능
- [X] 시리즈에 태그 붙이기
- [X] 썸네일 업로드
- [X] 포스트 컨텐츠에 이미지 끌어서 업로드 (PC용)
- [X] 포스트 컨텐츠에 이미지 올리기 버튼 (모바일/태블릿용)
- [X] 포스트에 태그 붙이기
- [X] 시리즈에서 포스트 리스트로 만들고 수정 삭제 가능하게
- [X] 에디터에서 PID 있으면 update api 호출
- [X] Delete 구현
- [X] 401 redirection과 기타 에러 Toast로 처리
- [X] SEO 구현
- [X] 다크 모드 코드 하이라이팅 스타일 처리
- [X] 하이라이팅시 unescaped HTML 고치기
- [ ] 포스트 에디터 라이브 프리뷰
- [X] 메인 페이지 네비게이션
- [ ] 포스트 안에서 시리즈 목록 보기