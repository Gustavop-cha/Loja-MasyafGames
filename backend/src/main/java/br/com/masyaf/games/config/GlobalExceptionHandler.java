package br.com.masyaf.games.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

/** Padroniza respostas de erro da API no formato { status, message, timestamp }. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacao(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return corpo(HttpStatus.BAD_REQUEST, "Dados inválidos — " + msg);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> integridade(DataIntegrityViolationException ex) {
        return corpo(HttpStatus.CONFLICT,
                "Operação viola uma restrição do banco (ex.: registro em uso por um pedido ou dado duplicado).");
    }

    private ResponseEntity<Map<String, Object>> corpo(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of(
                "status", status.value(),
                "message", mensagem,
                "timestamp", LocalDateTime.now().toString()));
    }
}
