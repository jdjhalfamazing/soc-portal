package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AssetPageController {

    @GetMapping("/assets")
    public String assets() {
        return "assets";
    }

}