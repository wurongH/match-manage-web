module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
            "sourceType": "module",
            "ecmaFeatures": {
            "jsx": true,
                "modules": true,
                "experimentalObjectRestSpread": true
        }
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
       /* "linebreak-style": [
            "error",
            "windows"
        ] //只能运行在哪个平台,放到mac会报错*/
        "no-unused-vars": 0,
        "no-undef": 0,
        "no-dupe-keys": 2,//对象中不允许出现重复的键
        "guard-for-in": 0, //监视for in循环，防止出现不可预料的情况
        "semi": ["error", "always"],//结束添加分号
        "no-debugger": 0,//允许出现debugger语句
        "no-console": "off",
    }
};