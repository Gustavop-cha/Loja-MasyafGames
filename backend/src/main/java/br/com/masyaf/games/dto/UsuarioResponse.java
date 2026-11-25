package br.com.masyaf.games.dto;
import br.com.masyaf.games.entity.Usuario;
/** token só vem preenchido na resposta do login. */
public record UsuarioResponse(Long id,String nome,String email,boolean admin,String token){
 public static UsuarioResponse from(Usuario u,boolean admin){return new UsuarioResponse(u.getId(),u.getNome(),u.getEmail(),admin,null);}
 public static UsuarioResponse comToken(Usuario u,boolean admin){return new UsuarioResponse(u.getId(),u.getNome(),u.getEmail(),admin,u.getToken());}
}
