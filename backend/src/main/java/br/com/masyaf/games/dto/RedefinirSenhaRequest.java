package br.com.masyaf.games.dto;
import jakarta.validation.constraints.*;
public record RedefinirSenhaRequest(@Email @NotBlank String email,@NotBlank @Pattern(regexp="\\d{6}",message="deve ter 6 dígitos") String codigo,@NotBlank @Size(min=6) String novaSenha){}
