#!/usr/bin/env python3
"""
AI Integrations Test Suite
Comprehensive testing for all integrated AI frameworks
"""

import asyncio
import logging
import sys
from typing import Dict, Any, List
import time
from datetime import datetime

# Import all integrations
from unified_ai_orchestrator import create_unified_orchestrator, OrchestratorConfig, AIFramework, AIOperation
from solana_agent_kit_integration import test_solana_agent_kit
from codigo_ai_integration import test_codigo_agent
from noah_ai_integration import test_noah_agent
from rig_framework_integration import test_rig_agent
from zerepy_integration import test_zerepy_agent
from eliza_framework_integration import test_eliza_agent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AIIntegrationTester:
    """Comprehensive test suite for AI frameworks integration"""
    
    def __init__(self):
        self.test_results: Dict[str, Dict[str, Any]] = {}
        self.orchestrator = None
        self.start_time = None
        
    async def run_all_tests(self):
        """Run complete test suite"""
        self.start_time = datetime.now()
        logger.info("🚀 Starting AI Integrations Test Suite")
        
        try:
            # Test individual frameworks
            await self._test_individual_frameworks()
            
            # Test unified orchestrator
            await self._test_unified_orchestrator()
            
            # Test cross-framework workflows
            await self._test_workflows()
            
            # Performance benchmarking
            await self._performance_benchmarks()
            
            # Generate test report
            await self._generate_test_report()
            
        except Exception as e:
            logger.error(f"❌ Test suite failed: {e}")
            return False
        
        logger.info("✅ Test suite completed successfully")
        return True
    
    async def _test_individual_frameworks(self):
        """Test each AI framework individually"""
        logger.info("🔍 Testing individual AI frameworks...")
        
        framework_tests = {
            'solana_agent_kit': test_solana_agent_kit,
            'codigo_ai': test_codigo_agent,
            'noah_ai': test_noah_agent,
            'rig_framework': test_rig_agent,
            'zerepy': test_zerepy_agent,
            'eliza_framework': test_eliza_agent
        }
        
        for framework_name, test_function in framework_tests.items():
            logger.info(f"Testing {framework_name}...")
            start_time = time.time()
            
            try:
                result = await test_function()
                execution_time = time.time() - start_time
                
                self.test_results[framework_name] = {
                    'individual_test': {
                        'success': result,
                        'execution_time': execution_time,
                        'error': None if result else 'Test function returned False'
                    }
                }
                
                if result:
                    logger.info(f"✅ {framework_name} test passed ({execution_time:.2f}s)")
                else:
                    logger.warning(f"⚠️ {framework_name} test failed ({execution_time:.2f}s)")
                    
            except Exception as e:
                execution_time = time.time() - start_time
                logger.error(f"❌ {framework_name} test error: {e}")
                
                self.test_results[framework_name] = {
                    'individual_test': {
                        'success': False,
                        'execution_time': execution_time,
                        'error': str(e)
                    }
                }
    
    async def _test_unified_orchestrator(self):
        """Test the unified orchestrator functionality"""
        logger.info("🎯 Testing Unified AI Orchestrator...")
        
        try:
            # Initialize orchestrator
            config = OrchestratorConfig()
            self.orchestrator = await create_unified_orchestrator(config)
            
            # Test framework status
            status = await self.orchestrator.get_framework_status()
            logger.info(f"Framework status retrieved: {len(status.get('frameworks', {}))} frameworks")
            
            # Test available workflows
            workflows = await self.orchestrator.get_available_workflows()
            logger.info(f"Available workflows: {len(workflows.get('workflows', {}))}")
            
            # Test single operation
            test_operation = AIOperation(
                operation_id="test_orchestrator_001",
                framework=AIFramework.ELIZA_FRAMEWORK,
                operation_type="start_conversation",
                parameters={"session_id": "test_session"}
            )
            
            operation_result = await self.orchestrator.execute_operation(test_operation)
            
            self.test_results['unified_orchestrator'] = {
                'initialization': True,
                'framework_status': bool(status),
                'workflows_available': bool(workflows),
                'operation_execution': operation_result.success,
                'operation_time': operation_result.execution_time
            }
            
            logger.info("✅ Unified orchestrator tests passed")
            
        except Exception as e:
            logger.error(f"❌ Unified orchestrator test failed: {e}")
            self.test_results['unified_orchestrator'] = {
                'initialization': False,
                'error': str(e)
            }
    
    async def _test_workflows(self):
        """Test cross-framework workflows"""
        logger.info("🔄 Testing cross-framework workflows...")
        
        if not self.orchestrator:
            logger.warning("⚠️ Skipping workflow tests - orchestrator not initialized")
            return
        
        workflow_tests = [
            {
                'name': 'voice_to_payment_with_verification',
                'parameters': {
                    'user_message': 'Send $100 to test address',
                    'session_id': 'test_workflow_session',
                    'recipient_address': 'test_address_123',
                    'payment_amount': 100
                }
            },
            {
                'name': 'complete_dapp_development',
                'parameters': {
                    'app_name': 'Test DApp',
                    'app_type': 'payment',
                    'session_id': 'test_dapp_session'
                }
            }
        ]
        
        workflow_results = {}
        
        for workflow_test in workflow_tests:
            workflow_name = workflow_test['name']
            logger.info(f"Testing workflow: {workflow_name}")
            
            try:
                start_time = time.time()
                
                result = await self.orchestrator.execute_workflow(
                    workflow_name,
                    workflow_test['parameters']
                )
                
                execution_time = time.time() - start_time
                
                workflow_results[workflow_name] = {
                    'success': result.get('success', False),
                    'execution_time': execution_time,
                    'workflow_id': result.get('workflow_id'),
                    'frameworks_used': len(result.get('results', {}))
                }
                
                if result.get('success'):
                    logger.info(f"✅ Workflow {workflow_name} completed ({execution_time:.2f}s)")
                else:
                    logger.warning(f"⚠️ Workflow {workflow_name} failed: {result.get('error')}")
                    
            except Exception as e:
                logger.error(f"❌ Workflow {workflow_name} error: {e}")
                workflow_results[workflow_name] = {
                    'success': False,
                    'error': str(e)
                }
        
        self.test_results['workflows'] = workflow_results
    
    async def _performance_benchmarks(self):
        """Run performance benchmarking tests"""
        logger.info("⚡ Running performance benchmarks...")
        
        if not self.orchestrator:
            logger.warning("⚠️ Skipping performance tests - orchestrator not initialized")
            return
        
        # Test concurrent operations
        concurrent_operations = []
        num_operations = 5
        
        for i in range(num_operations):
            operation = AIOperation(
                operation_id=f"perf_test_{i}",
                framework=AIFramework.ELIZA_FRAMEWORK,
                operation_type="start_conversation",
                parameters={"session_id": f"perf_session_{i}"}
            )
            concurrent_operations.append(operation)
        
        # Execute operations concurrently
        start_time = time.time()
        tasks = [
            self.orchestrator.execute_operation(op) 
            for op in concurrent_operations
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        total_time = time.time() - start_time
        
        # Analyze results
        successful_operations = sum(
            1 for result in results 
            if not isinstance(result, Exception) and result.success
        )
        
        average_time = total_time / num_operations if num_operations > 0 else 0
        
        self.test_results['performance'] = {
            'concurrent_operations': num_operations,
            'successful_operations': successful_operations,
            'success_rate': (successful_operations / num_operations) * 100,
            'total_time': total_time,
            'average_operation_time': average_time,
            'operations_per_second': num_operations / total_time if total_time > 0 else 0
        }
        
        logger.info(f"✅ Performance test completed: {successful_operations}/{num_operations} operations successful")
        logger.info(f"   Success rate: {self.test_results['performance']['success_rate']:.1f}%")
        logger.info(f"   Average time: {average_time:.2f}s per operation")
    
    async def _generate_test_report(self):
        """Generate comprehensive test report"""
        logger.info("📊 Generating test report...")
        
        total_execution_time = (datetime.now() - self.start_time).total_seconds()
        
        # Calculate overall statistics
        individual_tests_passed = sum(
            1 for framework_result in self.test_results.values()
            if framework_result.get('individual_test', {}).get('success', False)
        )
        
        total_individual_tests = len([
            result for result in self.test_results.values()
            if 'individual_test' in result
        ])
        
        workflow_tests_passed = sum(
            1 for workflow_result in self.test_results.get('workflows', {}).values()
            if workflow_result.get('success', False)
        )
        
        total_workflow_tests = len(self.test_results.get('workflows', {}))
        
        # Generate report
        report = f"""
{'='*80}
🧠 AI FRAMEWORKS INTEGRATION TEST REPORT
{'='*80}

📅 Test Date: {datetime.now().isoformat()}
⏱️  Total Execution Time: {total_execution_time:.2f} seconds

{'='*80}
📋 TEST SUMMARY
{'='*80}

Individual Framework Tests: {individual_tests_passed}/{total_individual_tests} passed
Workflow Tests: {workflow_tests_passed}/{total_workflow_tests} passed
Orchestrator Test: {'✅ PASSED' if self.test_results.get('unified_orchestrator', {}).get('initialization') else '❌ FAILED'}

{'='*80}
🔍 INDIVIDUAL FRAMEWORK RESULTS
{'='*80}
"""
        
        for framework_name, results in self.test_results.items():
            if 'individual_test' in results:
                test_result = results['individual_test']
                status = "✅ PASSED" if test_result['success'] else "❌ FAILED"
                report += f"{framework_name:25} | {status} | {test_result['execution_time']:.2f}s\n"
                
                if not test_result['success'] and test_result.get('error'):
                    report += f"{'':27} Error: {test_result['error']}\n"
        
        if 'workflows' in self.test_results:
            report += f"\n{'='*80}\n🔄 WORKFLOW TEST RESULTS\n{'='*80}\n"
            
            for workflow_name, workflow_result in self.test_results['workflows'].items():
                status = "✅ PASSED" if workflow_result.get('success') else "❌ FAILED"
                exec_time = workflow_result.get('execution_time', 0)
                frameworks_count = workflow_result.get('frameworks_used', 0)
                
                report += f"{workflow_name:35} | {status} | {exec_time:.2f}s | {frameworks_count} frameworks\n"
        
        if 'performance' in self.test_results:
            perf = self.test_results['performance']
            report += f"""
{'='*80}
⚡ PERFORMANCE BENCHMARKS
{'='*80}

Concurrent Operations: {perf['concurrent_operations']}
Success Rate: {perf['success_rate']:.1f}%
Average Operation Time: {perf['average_operation_time']:.2f}s
Operations Per Second: {perf['operations_per_second']:.2f}
"""
        
        report += f"""
{'='*80}
🎯 RECOMMENDATIONS
{'='*80}

"""
        
        # Add recommendations based on test results
        if individual_tests_passed == total_individual_tests:
            report += "✅ All individual framework tests passed - excellent integration!\n"
        else:
            failed_frameworks = [
                name for name, result in self.test_results.items()
                if 'individual_test' in result and not result['individual_test']['success']
            ]
            report += f"⚠️  Failed frameworks need attention: {', '.join(failed_frameworks)}\n"
        
        if 'performance' in self.test_results:
            perf = self.test_results['performance']
            if perf['success_rate'] >= 95:
                report += "✅ Excellent performance benchmarks achieved\n"
            elif perf['success_rate'] >= 80:
                report += "⚠️  Good performance, consider optimization for production\n"
            else:
                report += "❌ Performance needs improvement before production deployment\n"
        
        report += f"\n{'='*80}\n"
        
        # Print report
        print(report)
        
        # Save report to file
        report_filename = f"ai_integration_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        try:
            with open(report_filename, 'w') as f:
                f.write(report)
            logger.info(f"📄 Test report saved to {report_filename}")
        except Exception as e:
            logger.warning(f"⚠️ Could not save report file: {e}")
    
    async def cleanup(self):
        """Clean up test resources"""
        if self.orchestrator:
            try:
                await self.orchestrator.close()
                logger.info("🧹 Orchestrator resources cleaned up")
            except Exception as e:
                logger.warning(f"⚠️ Cleanup warning: {e}")

async def main():
    """Main test execution function"""
    tester = AIIntegrationTester()
    
    try:
        success = await tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        logger.info("🛑 Test suite interrupted by user")
        return 1
    except Exception as e:
        logger.error(f"❌ Test suite failed with unexpected error: {e}")
        return 1
    finally:
        await tester.cleanup()

if __name__ == "__main__":
    # Run the test suite
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
