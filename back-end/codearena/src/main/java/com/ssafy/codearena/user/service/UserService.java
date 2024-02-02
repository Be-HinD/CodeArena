package com.ssafy.codearena.user.service;

import com.ssafy.codearena.user.dto.*;
import jakarta.servlet.http.HttpServletResponse;

import java.net.http.HttpResponse;

public interface UserService {

    UserResultDto join(UserJoinDto userJoinDto);
    UserResultDto login(HttpServletResponse response, UserLoginDto userLoginDto);
    UserResultDto logout(String userEmail);
    UserResultDto checkDuplicatedNickname(String nickname);
    UserResultDto checkDuplicatedEmail(String email);
    UserResultDto reissue(UserReissueDto userReissueDto);
    UserResultDto searchUser(String userNickname);
    UserResultDto changePassword(UserChangePasswordDto userChangePasswordDto);
    UserResultDto changeUserInfo(UserChangeInfoDto userChangeInfoDto);
}
