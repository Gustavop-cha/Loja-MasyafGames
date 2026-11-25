package br.com.masyaf.games.repository;
import br.com.masyaf.games.entity.Usuario; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface UsuarioRepository extends JpaRepository<Usuario,Long>{ Optional<Usuario> findByEmailIgnoreCase(String email); Optional<Usuario> findByToken(String token); boolean existsByEmailIgnoreCase(String email); boolean existsByCpf(String cpf); }
