package br.com.masyaf.games.dto;
import jakarta.validation.constraints.*;
public record EsqueciSenhaRequest(@Email @NotBlank String email){}
