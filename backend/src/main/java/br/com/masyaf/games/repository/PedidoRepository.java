package br.com.masyaf.games.repository;

import br.com.masyaf.games.entity.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Carrega itens e jogos junto com o pedido (evita LazyInitializationException ao gerar o JSON)
    @EntityGraph(attributePaths = {"itens", "itens.jogo"})
    List<Pedido> findByUsuario_IdOrderByDataDesc(Long usuarioId);

    @EntityGraph(attributePaths = {"itens", "itens.jogo"})
    Optional<Pedido> findComItensById(Long id);
}
