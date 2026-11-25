package br.com.masyaf.games.controller;
import br.com.masyaf.games.entity.Produto; import br.com.masyaf.games.repository.ProdutoRepository; import br.com.masyaf.games.service.UsuarioService; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException; import java.util.List;
/** Leitura do catálogo é pública; criar, editar e excluir exigem o token do administrador. */
@RestController @RequestMapping("/api/jogos") public class ProdutoController {
 private static final String AUTH = "Authorization";
 private final ProdutoRepository repo; private final UsuarioService usuarios; public ProdutoController(ProdutoRepository r,UsuarioService u){repo=r;usuarios=u;}
 @GetMapping public List<Produto> listar(@RequestParam(required=false) String nome,@RequestParam(required=false) String plataforma){if(nome!=null&&!nome.isBlank())return repo.findByNomeContainingIgnoreCase(nome);if(plataforma!=null&&!plataforma.isBlank())return repo.findByPlataformaIgnoreCase(plataforma);return repo.findAll();}
 @GetMapping("/{id}") public Produto buscar(@PathVariable Long id){return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Jogo não encontrado"));}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Produto criar(@RequestHeader(value=AUTH,required=false) String auth,@RequestBody @jakarta.validation.Valid Produto p){usuarios.exigirAdmin(auth);p.setId(null);return repo.save(p);}
 @PutMapping("/{id}") public Produto atualizar(@RequestHeader(value=AUTH,required=false) String auth,@PathVariable Long id,@RequestBody @jakarta.validation.Valid Produto dados){usuarios.exigirAdmin(auth);Produto p=buscar(id);p.setNome(dados.getNome());p.setPreco(dados.getPreco());p.setImagem(dados.getImagem());p.setDescricao(dados.getDescricao());p.setPlataforma(dados.getPlataforma());return repo.save(p);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void excluir(@RequestHeader(value=AUTH,required=false) String auth,@PathVariable Long id){usuarios.exigirAdmin(auth);repo.delete(buscar(id));}
}
