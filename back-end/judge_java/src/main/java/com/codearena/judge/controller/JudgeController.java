package com.codearena.judge.controller;

import com.codearena.judge.dto.JudgeResultDto;
import com.codearena.judge.dto.JudgeValidationCheckDto;
import com.codearena.judge.service.JudgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/judge")
public class JudgeController {

    private final JudgeService judgeService;


    // 검증용 로직
    // 코드, 테케 필요
    @PostMapping("/validation")
    public ResponseEntity<JudgeResultDto> validationCheck(@RequestBody JudgeValidationCheckDto judgeValidationCheckDto) {
        return new ResponseEntity<JudgeResultDto>(judgeService.validationCheck(judgeValidationCheckDto), HttpStatus.OK);
    }

    // 효율전 채점 로직
    @PostMapping("/arena")
    public ResponseEntity<JudgeResultDto> judgeArena() {
        return null;
    }


    // 스피드전 채점 로직
    @PostMapping("/normal")
    public ResponseEntity<JudgeResultDto>  judgeNormal() {
        return null;
    }

}
