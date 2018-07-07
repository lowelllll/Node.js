# Express
> Node 상에서 동작하는 웹 프레임워크

### express 설치
```
npm install express --save
```
## express generator (express 애플리케이션 생성기)로 app 생성
1. `express-generator` 설치
    ```
    npm install express-generator -g
    ```
2. app 생성
    ```
    express myapp
    ```

해당 디렉토리에 myapp 디렉토리(app)이 생성됨.

3. 모듈 설치
    - `dependencise`에 정의되어있는 모듈을 설치함. (express,cookie 등)
    ```
    npm install
    ```
4. app 구동
    ```
    npm start
    ```


생성된 앱은 다음과 같은 디렉터리 구조를 가짐.
```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```