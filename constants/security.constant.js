import "dotenv/config";

export const PASSWORD_SALT_ROUNDS = Number.parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRES_IN = "1s";
export const JWT_REFRESH_TOKEN_EXPIRES_IN = "7d";

export function generateRandomToken() {
    // 변수에 원하는 토큰 길이(즉 문자열의 길이) 설정
    const length = 32;
    // 변수에 사용할 문자열 집합 설정
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // token으로 변수 설정하여 빈문자열로 시작
    let token = "";
    // for문을 사용하여 "length" 만큼 반복
    for (let i = 0; i < length; i++) {
        // Math.random 함수를 사용하여 난수를 생성
        // Math.floor 함수를 사용하여 난수의 내림한 값으로 변환
        // characters 문자열에서 하나의 문자를 선택
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // for문이 끝나면 생성된 랜덤한 token을 반환
    return token;
}
