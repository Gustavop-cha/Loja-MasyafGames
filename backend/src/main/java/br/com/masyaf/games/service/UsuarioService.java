package br.com.masyaf.games.service;
import br.com.masyaf.games.dto.*; import br.com.masyaf.games.entity.Usuario; import br.com.masyaf.games.repository.UsuarioRepository; import org.springframework.http.HttpStatus; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import org.springframework.web.server.ResponseStatusException;
@Service public class UsuarioService {
 private final UsuarioRepository repo; private final PasswordEncoder encoder; private final String adminEmail;
 public UsuarioService(UsuarioRepository r,PasswordEncoder e,@org.springframework.beans.factory.annotation.Value("${app.admin-email:}") String adminEmail){repo=r;encoder=e;this.adminEmail=adminEmail.trim();}

 // ===== Administração =====
 public boolean isAdmin(Usuario u){return !adminEmail.isEmpty() && adminEmail.equalsIgnoreCase(u.getEmail());}

 /** Recebe o header "Authorization: Bearer <token>" e só deixa passar o admin (401 sem login, 403 se não for admin). */
 public void exigirAdmin(String authorization){
  String token = authorization!=null && authorization.startsWith("Bearer ") ? authorization.substring(7).trim() : "";
  Usuario u = token.isEmpty() ? null : repo.findByToken(token).orElse(null);
  if(u==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Faça login para continuar");
  if(!isAdmin(u)) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Acesso restrito ao administrador");
 }

 public UsuarioResponse buscar(Long id){Usuario u=repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuário não encontrado"));return UsuarioResponse.from(u,isAdmin(u));}

 private String novoToken(){byte[] b=new byte[32];random.nextBytes(b);return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(b);}
 public UsuarioResponse cadastrar(CadastroRequest d){if(repo.existsByEmailIgnoreCase(d.email())) throw new ResponseStatusException(HttpStatus.CONFLICT,"E-mail já cadastrado"); String cpf=d.cpf().replaceAll("\\D",""); if(repo.existsByCpf(cpf)) throw new ResponseStatusException(HttpStatus.CONFLICT,"CPF já cadastrado"); Usuario u=new Usuario();u.setNome(d.nome());u.setEmail(d.email().toLowerCase());u.setSenha(encoder.encode(d.senha()));u.setCpf(cpf);u.setTelefone(d.telefone());u.setCep(d.cep());u.setRua(d.rua());u.setNumero(d.numero());u.setBairro(d.bairro());u.setCidade(d.cidade());u.setEstado(d.estado());u=repo.save(u);return UsuarioResponse.from(u,isAdmin(u));}
 public UsuarioResponse login(LoginRequest d){Usuario u=repo.findByEmailIgnoreCase(d.email()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciais inválidas"));if(!encoder.matches(d.senha(),u.getSenha()))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciais inválidas");if(u.getToken()==null){u.setToken(novoToken());u=repo.save(u);}return UsuarioResponse.comToken(u,isAdmin(u));}

 // ===== Recuperação de senha =====
 private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(UsuarioService.class);
 private static final java.security.SecureRandom random = new java.security.SecureRandom();
 private static final int VALIDADE_MINUTOS = 15;

 /** Gera um código de 6 dígitos. Responde igual exista ou não o e-mail, para não revelar quem tem cadastro. */
 public void solicitarRecuperacao(EsqueciSenhaRequest d){
  repo.findByEmailIgnoreCase(d.email()).ifPresent(u -> {
   String codigo = String.format("%06d", random.nextInt(1_000_000));
   u.setCodigoRecuperacao(encoder.encode(codigo));
   u.setCodigoExpiraEm(java.time.LocalDateTime.now().plusMinutes(VALIDADE_MINUTOS));
   repo.save(u);
   // Simula o envio do e-mail. Para enviar de verdade, troque por um JavaMailSender (spring-boot-starter-mail).
   log.info("[RECUPERAÇÃO DE SENHA] Código para {}: {} (válido por {} min)", u.getEmail(), codigo, VALIDADE_MINUTOS);
  });
 }

 /** Confere o código e grava a nova senha. O código só pode ser usado uma vez. */
 public void redefinirSenha(RedefinirSenhaRequest d){
  ResponseStatusException invalido = new ResponseStatusException(HttpStatus.BAD_REQUEST,"Código inválido ou expirado");
  Usuario u = repo.findByEmailIgnoreCase(d.email()).orElseThrow(() -> invalido);
  if(u.getCodigoRecuperacao()==null || u.getCodigoExpiraEm()==null || u.getCodigoExpiraEm().isBefore(java.time.LocalDateTime.now()) || !encoder.matches(d.codigo(),u.getCodigoRecuperacao())) throw invalido;
  u.setSenha(encoder.encode(d.novaSenha()));
  u.setCodigoRecuperacao(null);
  u.setCodigoExpiraEm(null);
  repo.save(u);
 }
}
