package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AssetPageController {

    @GetMapping("/assets")
    public String assets() {
        return "assets";
    }

    @GetMapping("/assets/{id}")
    public String assetDetails(@PathVariable Long id, Model model) {

        model.addAttribute("assetId", id);

        return "asset-details";
    }

}