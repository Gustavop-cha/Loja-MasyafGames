package br.com.masyaf.games.controller;

import br.com.masyaf.games.dto.*;
import br.com.masyaf.games.entity.*;
import br.com.masyaf.games.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidos;
    private final UsuarioRepository usuarios;
    private final ProdutoRepository jogos;

    public PedidoController(PedidoRepository p, UsuarioRepository u, ProdutoRepository j) {
        pedidos = p; usuarios = u; jogos = j;
    }

    /** POST /api/pedidos — cria um pedido; o total é calculado no servidor com os preços do banco. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Pedido criar(@RequestBody @Valid PedidoRequest d) {
        Usuario u = usuarios.findById(d.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Pedido p = new Pedido();
        p.setUsuario(u);
        double total = 0;
        for (ItemPedidoRequest item : d.itens()) {
            Produto jogo = jogos.findById(item.jogoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado: " + item.jogoId()));
            ItemPedido ip = new ItemPedido();
            ip.setPedido(p);
            ip.setJogo(jogo);
            ip.setQuantidade(item.quantidade());
            ip.setPrecoUnitario(jogo.getPreco());
            p.getItens().add(ip);
            total += jogo.getPreco() * item.quantidade();
        }
        p.setTotal(Math.round(total * 100.0) / 100.0);
        return pedidos.save(p);
    }

    /** GET /api/pedidos/usuario/{usuarioId} — histórico de pedidos do usuário. */
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> listar(@PathVariable Long usuarioId) {
        return pedidos.findByUsuario_IdOrderByDataDesc(usuarioId);
    }

    /** GET /api/pedidos/{id} — detalhe de um pedido. */
    @GetMapping("/{id}")
    public Pedido buscar(@PathVariable Long id) {
        return pedidos.findComItensById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    /** DELETE /api/pedidos/{id} — cancela (exclui) um pedido e seus itens. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void cancelar(@PathVariable Long id) {
        Pedido p = pedidos.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        pedidos.delete(p);
    }
}
