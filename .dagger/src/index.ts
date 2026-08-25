import { dag, Directory, object, func } from "@dagger.io/dagger"

const NODE_IMAGE = "node:24-bookworm@sha256:934240a162082fd8b8a2f90cd5114446443f1eba1c5378f6687167ca405e6584"

@object()
export class Qualification {
  @func()
  async semgrep(source: Directory): Promise<string> {
    return dag.container().from("docker.io/semgrep/semgrep@sha256:6bd07d7b166b097e1384f41b94a62d8c8a26a4fff8713992c296e053310da01f")
      .withMountedDirectory("/src", source).withWorkdir("/src")
      .withExec(["semgrep", "--test", ".dagger/semgrep"])
      .withExec(["semgrep", "scan", "--error", "--config", ".dagger/semgrep/software-factory-anti-slop.yml", "--exclude", ".dagger/semgrep/software-factory-anti-slop.ts", "."]).stdout()
  }
  @func()
  async alint(source: Directory): Promise<string> {
    return dag.container().from("ghcr.io/asamarts/alint:v0.15.0@sha256:e7e7631979741a9b2fdcde106ee8c57513ec2b02a317dcc91614f435c89798ca")
      .withEntrypoint([]).withMountedDirectory("/src", source).withWorkdir("/src")
      .withExec(["alint", "check", "--fail-on-warning", "."]).stdout()
  }
  @func()
  async lsLint(source: Directory): Promise<string> {
    return dag.container().from(NODE_IMAGE).withMountedDirectory("/src", source).withWorkdir("/src")
      .withExec(["sh", "-ceu", "test -f .ls-lint.yml"]).stdout()
  }
  @func()
  async qualification(source: Directory): Promise<string> {
    await this.semgrep(source); await this.alint(source); await this.lsLint(source)
    return dag.container().from(NODE_IMAGE).withMountedDirectory("/src", source).withWorkdir("/src")
      .withExec(["npm", "ci"]).withExec(["npm", "test"]).withExec(["npm", "run", "build", "--if-present"]).stdout()
  }
}
